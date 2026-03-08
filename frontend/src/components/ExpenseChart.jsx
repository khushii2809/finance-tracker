import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
  } from "recharts"
  
  const data = [
    { name: "Food", value: 4000 },
    { name: "Transport", value: 2000 },
    { name: "Shopping", value: 3000 },
    { name: "Bills", value: 9000 }
  ]
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
  
  function ExpenseChart() {
  
    return (
  
      <div style={{ width: "100%", height: 300 }}>
  
        <h3>Expense Breakdown</h3>
  
        <ResponsiveContainer>
  
          <PieChart>
  
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
            >
  
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
  
            </Pie>
  
            <Tooltip />
  
          </PieChart>
  
        </ResponsiveContainer>
  
      </div>
  
    )
  
  }
  
  export default ExpenseChart