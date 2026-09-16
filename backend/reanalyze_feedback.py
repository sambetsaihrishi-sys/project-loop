from app.core.database import SessionLocal
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.feedback import Feedback
from app.services.feedback_analyzer import analyze_feedback


db = SessionLocal()

try:
    feedback_items = db.query(Feedback).all()

    for item in feedback_items:
        analysis = analyze_feedback(item.content)

        item.sentiment = analysis["sentiment"]
        item.theme = analysis["theme"]

        print(
            f"Feedback {item.id}: "
            f"{analysis['sentiment']} | "
            f"{analysis['theme']}"
        )

    db.commit()

    print(
        f"Successfully re-analyzed "
        f"{len(feedback_items)} feedback records."
    )

except Exception as error:
    db.rollback()
    print("Error:", error)

finally:
    db.close()