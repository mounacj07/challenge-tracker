from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "ChallengeQuest API is running"}

@app.get("/test")
def test():
    return {"status": "working"}