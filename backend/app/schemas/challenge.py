from pydantic import BaseModel

class ChallengeCreate(BaseModel):
    title: str
    description: str
    duration_days: int
    