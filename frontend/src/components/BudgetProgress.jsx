function BudgetProgress() {

    const budget = 30000
    const spent = 18000
  
    const percent = (spent / budget) * 100
  
    return (
  
      <div className="budget-card">
  
        <h3>Monthly Budget</h3>
  
        <p>Spent ₹{spent} of ₹{budget}</p>
  
        <div className="progress-bar">
  
          <div
            className="progress-fill"
            style={{ width: `${percent}%` }}
          ></div>
  
        </div>
  
        <p>{percent.toFixed(0)}% used</p>
  
      </div>
  
    )
  
  }
  
  export default BudgetProgress