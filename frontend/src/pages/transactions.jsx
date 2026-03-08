import { useState, useEffect } from "react";
import api from "../api/api";

function Transactions() {

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  const fetchCategories = async () => {

    try {

      const res = await api.get("/categories");

      setCategories(res.data);

    } catch (error) {
      console.error("Category error:", error);
    }

  };

  // Fetch transactions
  const fetchTransactions = async () => {

    try {

      const res = await api.get("/transactions");

      setTransactions(res.data);

    } catch (error) {
      console.error("Transaction error:", error);
    }

  };

  useEffect(() => {

    fetchTransactions();
    fetchCategories();

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const transactionData = {
        amount: parseFloat(amount),
        type: type,
        description: description,
        category_id: parseInt(categoryId),
        transaction_date: new Date().toISOString()
      };

      await api.post("/transactions", transactionData);

      alert("Transaction added!");

      setAmount("");
      setDescription("");
      setCategoryId("");

      fetchTransactions();

    } catch (error) {

      console.error(error);
      alert("Failed to add transaction");

    }

  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Add Transaction</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          required
        />

        <br/><br/>

        <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <br/><br/>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <br/><br/>

        <select
          value={categoryId}
          onChange={(e)=>setCategoryId(e.target.value)}
          required
        >

          <option value="">Select Category</option>

          {categories.map((c)=>(
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}

        </select>

        <br/><br/>

        <button type="submit">
          Add Transaction
        </button>

      </form>

      <hr style={{margin:"40px 0"}}/>

      <h2>Transactions</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((t)=>(
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>₹{t.amount}</td>
              <td>{t.type}</td>
              <td>{t.description}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  )

}

export default Transactions;