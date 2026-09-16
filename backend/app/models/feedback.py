from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.core.database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=True
    )

    customer_name = Column(
        String(100),
        nullable=True
    )

    customer_email = Column(
        String(255),
        nullable=True
    )

    channel = Column(
        String(50),
        nullable=False,
        default="Manual"
    )

    content = Column(
        Text,
        nullable=False
    )

    sentiment = Column(
        String(30),
        nullable=True
    )

    theme = Column(
        String(100),
        nullable=True
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )