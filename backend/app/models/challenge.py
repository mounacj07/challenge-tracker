from sqlalchemy import Column, Integer, String
from app.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(String)
    duration_days = Column(Integer)