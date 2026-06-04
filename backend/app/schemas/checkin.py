from pydantic import BaseModel

class CheckInCreate(BaseModel):
    user_id: int
    challenge_id: int