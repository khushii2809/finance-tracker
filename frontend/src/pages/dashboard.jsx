import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard() {

  const [data, setData] = useState(null)

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token")

        const response = await axios.get(
          "http://127.0.0.1:8000/dashboard?month=3&year=2026",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setData(response.data)

      } catch (error) {

        console.error("Dashboard error:", error)

      }

    }

    fetchDashboard()

  }, [])

  if (!data) {
    return <h2>Loading dashboard...</h2>
  }

  return (
    <div>

      <h1>Finance Dashboard</h1>

      <p>Total Income: ₹{data.total_income}</p>
      <p>Total Expense: ₹{data.total_expense}</p>
      <p>Net Savings: ₹{data.net_savings}</p>
      <p>Savings Rate: {data.savings_rate_percent}%</p>

    </div>
  )
}

export default Dashboard