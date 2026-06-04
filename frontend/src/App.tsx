import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {

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

  }, [])

  return (
    <div>
      <h1>ChallengeQuest</h1>
      <p>XP: {xp}</p>
      <p>Level: {level}</p>
      <p>Streak: {streak}</p>
    </div>
  )
}

export default App