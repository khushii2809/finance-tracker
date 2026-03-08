import StatCard from "../components/StatCard"

function Dashboard() {

  return (

    <div>

      <h1 style={{marginBottom:"30px"}}>Finance Dashboard</h1>

      <div className="cards">

        <StatCard
          title="Total Income"
          amount="45000"
        />

        <StatCard
          title="Total Expense"
          amount="18000"
        />

        <StatCard
          title="Savings"
          amount="27000"
        />

        <StatCard
          title="Savings Rate"
          amount="60%"
        />

      </div>

    </div>

  )

}

export default Dashboard