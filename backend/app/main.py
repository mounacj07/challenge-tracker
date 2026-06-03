from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import engine, Base, get_db
from app.models.user import User
from app.schemas.user import UserCreate

from app.models.challenge import Challenge
from app.schemas.challenge import ChallengeCreate

from app.models.challenge_member import ChallengeMember
from app.schemas.challenge_member import JoinChallenge

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def home():
    return {"message": "ChallengeQuest API is running"}


@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    new_user = User(
        username=user.username,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }

@app.get("/users")
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return users

@app.post("/challenges")
def create_challenge(
    challenge: ChallengeCreate,
    db: Session = Depends(get_db)
):

    new_challenge = Challenge(
        title=challenge.title,
        description=challenge.description,
        duration_days=challenge.duration_days
    )

    db.add(new_challenge)
    db.commit()
    db.refresh(new_challenge)

    return new_challenge

@app.get("/challenges")
def get_challenges(db: Session = Depends(get_db)):

    challenges = db.query(Challenge).all()

    return challenges

@app.post("/join")
def join_challenge(
    data: JoinChallenge,
    db: Session = Depends(get_db)
):

    membership = ChallengeMember(
        user_id=data.user_id,
        challenge_id=data.challenge_id
    )

    db.add(membership)
    db.commit()

    return {"message": "Joined challenge"}