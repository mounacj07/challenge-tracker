from sqlalchemy import Column, Integer, DateTime, ForeignKey
from app.database import Base
from datetime import datetime, timezone

class ChallengeRun(Base):
    __tablename__="challenge_runs"

    id=Column(Integer, primary_key=True, index=True)
    user_id=Column(Integer, ForeignKey("users.id"))
    challenge_id=Column(Integer, ForeignKey("challenges.id"))
    started_at=Column(DateTime, default=lambda:datetime.now(timezone.utc))
    completed_at=Column(DateTime, nullable=True)
