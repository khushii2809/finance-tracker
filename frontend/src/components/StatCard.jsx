function StatCard({title, amount}){

    return(
  
      <div className="card">
  
        <h4>{title}</h4>
  
        <h2>₹ {amount}</h2>
  
      </div>
  
    )
  
  }
  
  export default StatCard