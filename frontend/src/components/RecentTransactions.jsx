function RecentTransactions() {

    const transactions = [
      { id: 1, title: "Groceries", category: "Food", amount: 1500 },
      { id: 2, title: "Uber", category: "Transport", amount: 350 },
      { id: 3, title: "Netflix", category: "Entertainment", amount: 649 },
      { id: 4, title: "Electricity Bill", category: "Bills", amount: 2200 }
    ]
  
    return (
  
      <div className="table-card">
  
        <h3>Recent Transactions</h3>
  
        <table className="transaction-table">
  
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
  
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.category}</td>
                <td>₹ {t.amount}</td>
              </tr>
            ))}
          </tbody>
  
        </table>
  
      </div>
  
    )
  
  }
  
  export default RecentTransactions