import { Link } from "react-router-dom"

function Sidebar(){

  return(

    <div className="sidebar">

      <h2 className="logo">FinanceAI</h2>

      <nav className="menu">

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>

      </nav>

    </div>

  )

}

export default Sidebar