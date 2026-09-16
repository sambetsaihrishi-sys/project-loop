from pydantic import BaseModel, Field


class AskLoopRequest(BaseModel):
    question: str = Field(min_length=2, max_length=1000)


class AskLoopResponse(BaseModel):
    answer: str
    analyzed_feedback: int