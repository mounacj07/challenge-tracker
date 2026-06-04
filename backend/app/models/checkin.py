from sqlalchemy import Column, Integer, ForeignKey, Date
from app.database import Base

class CheckIn(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    challenge_id = Column(Integer, ForeignKey("challenges.id"))

    date = Column(Date)