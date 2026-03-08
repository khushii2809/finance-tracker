import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
  } from "recharts"
  
  const data = [
    { category: "Food", amount: 5000 },
    { category: "Transport", amount: 2000 },
    { category: "Shopping", amount: 4000 },
    { category: "Bills", amount: 7000 }
  ]
  
  function CategoryChart() {
  
    return (
  
      <div style={{ width: "100%", height: 300 }}>
  
        <h3>Category Spending</h3>
  
        <ResponsiveContainer>
  
          <BarChart data={data}>
  
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis dataKey="category" />
  
            <YAxis />
  
            <Tooltip />
  
            <Bar
              dataKey="amount"
              fill="#10b981"
            />
  
          </BarChart>
  
        </ResponsiveContainer>
  
      </div>
  
    )
  
  }
  
  export default CategoryChart