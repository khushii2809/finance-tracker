import StatCard from "../components/StatCard"
import ExpenseChart from "../components/ExpenseChart"
import MonthlyChart from "../components/MonthlyChart"
import CategoryChart from "../components/CategoryChart"
import RecentTransactions from "../components/RecentTransactions"
import BudgetProgress from "../components/BudgetProgress"

function Dashboard() {

  return (

    <div>

      <h1 style={{marginBottom:"30px"}}>Finance Dashboard</h1>

      <div className="cards">

        <StatCard title="Total Income" amount="45000"/>
        <StatCard title="Total Expense" amount="18000"/>
        <StatCard title="Savings" amount="27000"/>
        <StatCard title="Savings Rate" amount="60%"/>

      </div>

      <div style={{
        marginTop:"50px",
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"40px"
      }}>

        <ExpenseChart/>
        <MonthlyChart/>

      </div>

      <div style={{marginTop:"50px"}}>

        <CategoryChart/>

      </div>

      <div style={{
        marginTop:"50px",
        display:"grid",
        gridTemplateColumns:"2fr 1fr",
        gap:"40px"
      }}>

        <RecentTransactions/>
        <BudgetProgress/>

      </div>

    </div>

  )

}

export default Dashboard