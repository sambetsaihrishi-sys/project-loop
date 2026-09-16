from app.core.database import SessionLocal

# Import all related models so SQLAlchemy knows all tables
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.feedback import Feedback


db = SessionLocal()

try:
    user = (
        db.query(User)
        .filter(User.email == "rishi3@loop.com")
        .first()
    )

    if not user:
        print("User not found.")
        raise SystemExit

    membership = (
        db.query(Membership)
        .filter(Membership.user_id == user.id)
        .first()
    )

    if not membership:
        print("Workspace membership not found.")
        raise SystemExit

    print(f"User: {user.email}")
    print(f"Workspace ID: {membership.organization_id}")

    feedback_items = (
        db.query(Feedback)
        .filter(
            Feedback.created_by == user.id,
            Feedback.organization_id.is_(None)
        )
        .all()
    )

    for item in feedback_items:
        item.organization_id = membership.organization_id

    db.commit()

    print(f"Updated {len(feedback_items)} feedback records successfully.")

except Exception as error:
    db.rollback()
    print("Error:", error)

finally:
    db.close()