from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.feedback import Feedback
from app.models.membership import Membership
from app.schemas.ai import AskLoopRequest, AskLoopResponse
from app.services.ai_service import generate_ai_answer


router = APIRouter(
    prefix="/ai",
    tags=["AI Intelligence"]
)


@router.post("/ask", response_model=AskLoopResponse)
def ask_loop(
    request: AskLoopRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == current_user.id)
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=404,
            detail="Workspace membership not found"
        )

    feedback = (
        db.query(Feedback)
        .filter(
            Feedback.organization_id
            == membership.organization_id
        )
        .all()
    )

    total = len(feedback)

    if total == 0:
        return {
            "answer": "There is no customer feedback available in this workspace yet.",
            "analyzed_feedback": 0
        }

    ai_answer = generate_ai_answer(
    request.question,
    feedback
    )

    if ai_answer:
     return {
        "answer": ai_answer,
        "analyzed_feedback": total
        } 
    positive = [
        item for item in feedback
        if item.sentiment == "Positive"
    ]

    negative = [
        item for item in feedback
        if item.sentiment == "Negative"
    ]

    neutral = [
        item for item in feedback
        if item.sentiment == "Neutral"
    ]

    theme_counts = {}

    for item in feedback:
        theme = item.theme or "General"
        theme_counts[theme] = (
            theme_counts.get(theme, 0) + 1
        )

    top_theme = max(
        theme_counts,
        key=theme_counts.get
    )

    question = request.question.lower()

    if (
        "negative" in question
        or "complaint" in question
        or "problem" in question
    ):
        if negative:
            examples = negative[:3]

            issues = "; ".join(
                item.content
                for item in examples
            )

            answer = (
                f"I analyzed {total} feedback records in this workspace. "
                f"I found {len(negative)} negative records. "
                f"Key customer complaints include: {issues}"
            )
        else:
            answer = (
                "No negative customer feedback "
                "has been detected in this workspace."
            )

    elif "positive" in question:
        answer = (
            f"{len(positive)} out of {total} "
            f"feedback records are positive."
        )

    elif (
        "theme" in question
        or "topic" in question
        or "issue" in question
    ):
        answer = (
            f"The most discussed customer theme is "
            f"'{top_theme}' with "
            f"{theme_counts[top_theme]} feedback records."
        )

    elif "sentiment" in question:
        answer = (
            f"From {total} workspace feedback records, "
            f"{len(positive)} are positive, "
            f"{len(neutral)} are neutral and "
            f"{len(negative)} are negative."
        )

    else:
        answer = (
            f"I analyzed {total} customer feedback records "
            f"from this workspace. "
            f"The leading theme is '{top_theme}'. "
            f"There are {len(positive)} positive, "
            f"{len(neutral)} neutral and "
            f"{len(negative)} negative feedback records."
        )

    return {
        "answer": answer,
        "analyzed_feedback": total
    }