from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class FeedbackCreate(BaseModel):
    customer_name: str | None = None
    customer_email: EmailStr | None = None
    channel: str = "Manual"
    content: str = Field(min_length=3, max_length=5000)


class FeedbackResponse(BaseModel):
    id: int
    customer_name: str | None = None
    customer_email: str | None = None
    channel: str
    content: str
    sentiment: str | None = None
    theme: str | None = None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True