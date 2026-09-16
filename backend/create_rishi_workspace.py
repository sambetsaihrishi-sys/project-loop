from app.core.database import SessionLocal
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership


db = SessionLocal()

try:
    user = (
        db.query(User)
        .filter(User.email == "rishi3@loop.com")
        .first()
    )

    if not user:
        print("User not found.")
    else:
        existing_membership = (
            db.query(Membership)
            .filter(Membership.user_id == user.id)
            .first()
        )

        if existing_membership:
            print("This user already has a workspace membership.")
        else:
            organization = Organization(
                name="Rishi's Workspace",
                slug=f"rishi-{user.id}"
            )

            db.add(organization)
            db.commit()
            db.refresh(organization)

            membership = Membership(
                user_id=user.id,
                organization_id=organization.id,
                role="admin"
            )

            db.add(membership)

            user.role = "admin"

            db.commit()

            print("Workspace created successfully.")
            print("Workspace:", organization.name)
            print("Role: admin")

finally:
    db.close()