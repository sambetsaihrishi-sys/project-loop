from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    UniqueConstraint
)
from sqlalchemy.sql import func

from app.core.database import Base


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=False
    )

    role = Column(
        String(50),
        default="member"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "organization_id",
            name="unique_user_organization"
        ),
    )