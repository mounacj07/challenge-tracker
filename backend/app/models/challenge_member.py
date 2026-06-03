from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class ChallengeMember(Base):
    __tablename__ = "challenge_members"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    challenge_id = Column(Integer, ForeignKey("challenges.id"))