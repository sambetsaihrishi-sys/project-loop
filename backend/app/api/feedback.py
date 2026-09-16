import csv
import io

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.api.auth import get_current_user
from app.models.user import User
from app.models.membership import Membership
from app.services.feedback_analyzer import analyze_feedback


router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


def get_current_membership(
    db: Session,
    current_user: User
):
    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == current_user.id
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=404,
            detail="Workspace membership not found"
        )

    return membership


@router.post(
    "/",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED
)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = get_current_membership(
        db,
        current_user
    )

    analysis = analyze_feedback(
        feedback_data.content
    )

    new_feedback = Feedback(
        organization_id=membership.organization_id,
        customer_name=feedback_data.customer_name,
        customer_email=feedback_data.customer_email,
        channel=feedback_data.channel,
        content=feedback_data.content,
        sentiment=analysis["sentiment"],
        theme=analysis["theme"],
        created_by=current_user.id
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


@router.get(
    "/",
    response_model=list[FeedbackResponse]
)
def get_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = get_current_membership(
        db,
        current_user
    )

    feedback_list = (
        db.query(Feedback)
        .filter(
            Feedback.organization_id
            == membership.organization_id
        )
        .order_by(
            Feedback.created_at.desc()
        )
        .all()
    )

    return feedback_list


@router.post("/import-csv")
async def import_feedback_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = get_current_membership(
        db,
        current_user
    )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported"
        )

    try:
        file_bytes = await file.read()

        decoded_file = file_bytes.decode(
            "utf-8-sig"
        )

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        if not reader.fieldnames:
            raise HTTPException(
                status_code=400,
                detail="CSV file has no headers"
            )

        normalized_headers = {
            header.strip().lower()
            for header in reader.fieldnames
            if header
        }

        if "content" not in normalized_headers:
            raise HTTPException(
                status_code=400,
                detail=(
                    "CSV must contain a "
                    "'content' column"
                )
            )

        imported_count = 0
        skipped_count = 0

        for raw_row in reader:
            row = {
                str(key).strip().lower():
                (value or "").strip()
                for key, value in raw_row.items()
                if key
            }

            content = row.get(
                "content",
                ""
            )

            if not content:
                skipped_count += 1
                continue

            analysis = analyze_feedback(
                content
            )

            feedback = Feedback(
                organization_id=membership.organization_id,
                customer_name=(
                    row.get("customer_name")
                    or None
                ),
                customer_email=(
                    row.get("customer_email")
                    or None
                ),
                channel=(
                    row.get("channel")
                    or "CSV Import"
                ),
                content=content,
                sentiment=analysis["sentiment"],
                theme=analysis["theme"],
                created_by=current_user.id
            )

            db.add(feedback)

            imported_count += 1

        db.commit()

        return {
            "message": "CSV import completed",
            "imported": imported_count,
            "skipped": skipped_count
        }

    except HTTPException:
        db.rollback()
        raise

    except UnicodeDecodeError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to read CSV. "
                "Please save it as UTF-8."
            )
        )

    except Exception as error:
        db.rollback()

        print(
            "CSV import error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to import CSV"
        )