import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from "recharts"
  
  const data = [
    { month: "Jan", expense: 12000 },
    { month: "Feb", expense: 15000 },
    { month: "Mar", expense: 18000 },
    { month: "Apr", expense: 14000 },
    { month: "May", expense: 20000 },
    { month: "Jun", expense: 17000 }
  ]
  
  function MonthlyChart() {
  
    return (
  
      <div style={{ width: "100%", height: 300 }}>
  
        <h3>Monthly Spending Trend</h3>
  
        <ResponsiveContainer>
  
          <LineChart data={data}>
  
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis dataKey="month" />
  
            <YAxis />
  
            <Tooltip />
  
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#3b82f6"
              strokeWidth={3}
            />
  
          </LineChart>
  
        </ResponsiveContainer>
  
      </div>
  
    )
  
  }
  
  export default MonthlyChart