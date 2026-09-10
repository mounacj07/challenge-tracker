import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(0)
  const [streak, setStreak] = useState(0)
  const [challenges, setChallenges] = useState<any[]>([])
  const [badges, setBadges] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [joined, setJoined] = useState(false)
  const [completedDays, setCompletedDays] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkIns, setCheckIns]=useState<any[]>([])

  const checkIn = () => {

    axios
      .post("http://127.0.0.1:8000/checkin", {
        user_id: 1,
        challenge_id: 1
      })
      .then((response) => {
        alert(response.data.message)
        fetchDashboard()
      })

  }

  const fetchDashboard = () => {
        axios
      .get("http://127.0.0.1:8000/xp/1")
      .then((response) => {
        console.log(response.data)
        setXp(response.data.xp)
      })

    axios
      .get("http://127.0.0.1:8000/level/1")
      .then((response) => {
        setLevel(response.data.level)
      })

    axios
      .get("http://127.0.0.1:8000/streak/1/1")
      .then((response)=> {
        setStreak(response.data.streak)
      })

    axios
      .get("http://127.0.0.1:8000/challenges")
      .then((response)=> {
        console.log(response.data)
        setChallenges(response.data)
      })

    axios
      .get("http://127.0.0.1:8000/badges/1")
      .then((response) => {
        setBadges(response.data)
      })

    axios
      .get("http://127.0.0.1:8000/progress/1/1")
      .then((response) => {
        setProgress(response.data.progress)
        setCompletedDays(response.data.completed_days)
      })

    axios
      .get("http://127.0.0.1:8000/joined/1/1")
      .then((response)=>{
        setJoined(response.data.joined)
      })

    axios 
      .get("http://127.0.0.1:8000/checked-in/1/1")
      .then((response)=>{
        console.log("CHECKED IN:", response.data)
        setCheckedIn(response.data.checked_in)
      })

    axios
      .get("http://127.0.0.1:8000/checkins")
      .then((response)=>{
        const sortedCheckins =response.data.sort(
          (a:any, b:any)=>
            new Date(b.date).getTime()-new Date(a.date).getTime()
        )

        const filteredCheckins= sortedCheckins.filter(
          (checkin:any)=>checkin.challenge_id===1
        )

        setCheckIns(filteredCheckins)
      })
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const joinChallenge = (challengeId: number) => {

    axios
      .post("http://127.0.0.1:8000/join", {
        user_id:1,
        challenge_id:challengeId
      })
      .then((response)=>{
        console.log(response.data)
        alert(response.data.message)
        setJoined(true)
      })
  }


  return (
    <div>
      <h1>ChallengeQuest</h1>
      <p>XP: {xp}</p>
      <p>Level: {level}</p>
      <p>Streak: {streak}</p>
      <p>Progress: {completedDays} / {challenges[0]?.duration_days} days completed</p>

      <p>Challenge Progress</p>

    <div
      style={{
        width: "300px",
        height: "20px",
        backgroundColor: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#22c55e",
          borderRadius: "10px"
        }}
      />
    </div>

      <h2>Challenges</h2>
      <ul>
        {challenges.map((challenge:any)=> (
          <li key={challenge.id}>
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <p>Duration: {challenge.duration_days} days</p>
            <p>
              Progress:{completedDays} / {challenge.duration_days} days
            </p>
          </li>
        ))}
      </ul>

      <button 
        onClick={checkIn}
        disabled={checkedIn}
      >
        {checkedIn? "Checked In": "Check In Today"}
      </button>

      <h2>Check-in History</h2>
      <p>Total check-ins: {checkIns.length}</p>

      {checkIns.length===0 ? (
        <p>No check-ins yet. Start today!</p>
      ):(
        <ul>
          {checkIns.map((checkin)=>(
            <li key={checkin.id}>
              {new Date(checkin.date).toDateString()}
              {checkin.date=== new Date().toISOString().split("T")[0]&&"-Today ✓"}
            </li>
          ))}
        </ul>
      )
      }

      <h2>Join Challenges</h2>
      <ul>
        {challenges.map((challenge:any)=>(
          <li key={challenge.id}>
            {challenge.title}<br></br>
            Duration: {challenge.duration_days}<br></br>

            <button onClick={()=>joinChallenge(challenge.id)}
                    disabled={joined}>
              {joined? "Joined" :"Join"}
            </button>
          </li>
        ))}
      </ul>

      <h2>Badges</h2>

      <ul>
        {badges.map((badge) => (
          <li key={badge}>{badge}</li>
        ))}
      </ul>

    </div>
  )
}

export default App