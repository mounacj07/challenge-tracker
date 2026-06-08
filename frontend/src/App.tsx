import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(0)
  const [streak, setStreak] = useState(0)
  const [challenges, setChallenges] = useState([])
  const [badges, setBadges] = useState<string[]>([])

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
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const joinChallenge = () => {

    axios
      .post("http://127.0.0.1:8000/join", {
        user_id:1,
        challenge_id:1
      })
      .then((response)=>{
        console.log(response.data)
        alert(response.data.message)
      })
  }


  return (
    <div>
      <h1>ChallengeQuest</h1>
      <p>XP: {xp}</p>
      <p>Level: {level}</p>
      <p>Streak: {streak}</p>

      <h2>Challenges</h2>
      <ul>
        {challenges.map((challenge:any)=> (
          <li key={challenge.id}>
            {challenge.title}
          </li>
        ))}
      </ul>

      <button onClick={checkIn}>
      Check In Today
      </button>

      <h2>Join Challenges</h2>
      <ul>
        {challenges.map((challenge:any)=>(
          <li key={challenge.id}>
            {challenge.title}<br></br>
            Duration: {challenge.duration_days}
          </li>
        ))}
      </ul>

      <button onClick={joinChallenge}>
        Join
      </button>

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