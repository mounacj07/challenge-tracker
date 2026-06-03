from pydantic import BaseModel

class JoinChallenge(BaseModel):
    user_id: int
    challenge_id: int