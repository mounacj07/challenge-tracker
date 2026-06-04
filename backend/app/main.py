from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import engine, Base, get_db
from app.models.user import User
from app.schemas.user import UserCreate

from app.models.challenge import Challenge
from app.schemas.challenge import ChallengeCreate

from app.models.challenge_member import ChallengeMember
from app.schemas.challenge_member import JoinChallenge

from app.models.checkin import CheckIn
from app.schemas.checkin import CheckInCreate
from datetime import date, timedelta

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

@app.post("/checkin")
def create_checkin(
    checkin: CheckInCreate,
    db: Session = Depends(get_db)
):
    existing_checkin = (
    db.query(CheckIn)
    .filter(
        CheckIn.user_id == checkin.user_id,
        CheckIn.challenge_id == checkin.challenge_id,
        CheckIn.date == date.today()
    )
    .first()
)

    if existing_checkin:
        return {
            "message": "Already checked in today"
        }

    new_checkin = CheckIn(
        user_id=checkin.user_id,
        challenge_id=checkin.challenge_id,
        date=date.today()
    )

    db.add(new_checkin)

    user = (
    db.query(User)
    .filter(User.id == checkin.user_id)
    .first()
    )

    user.xp += 10

    db.commit()
    db.refresh(new_checkin)

    return {
        "message": "Check-in successful",
        "date": new_checkin.date
    }

@app.get("/checkins")
def get_checkins(db: Session = Depends(get_db)):

    checkins = db.query(CheckIn).all()

    return checkins

@app.get("/streak/{user_id}/{challenge_id}")
def get_streak(
    user_id: int,
    challenge_id: int,
    db: Session = Depends(get_db)
):
    
    checkins = (
        db.query(CheckIn)
        .filter(
            CheckIn.user_id == user_id,
            CheckIn.challenge_id == challenge_id
        )
        .order_by(CheckIn.date.desc())
        .all()
    )

    if not checkins:
        return {"streak": 0}

    streak = 0
    expected_date = date.today()

    for checkin in checkins:

        if checkin.date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)

        elif checkin.date > expected_date:
            continue

        else:
            break

    return {"streak": streak}

@app.get("/xp/{user_id}")
def get_xp(user_id: int, db: Session = Depends(get_db)):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    return {
        "xp": user.xp
    }

@app.get("/level/{user_id}")
def get_level(user_id: int, db: Session = Depends(get_db)):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    level = user.xp // 100 + 1

    return {
        "xp": user.xp,
        "level": level
    }