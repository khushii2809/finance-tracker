import { useState } from "react";
import api from "../api/api";

function Transactions() {

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const transactionData = {
        amount: parseFloat(amount),
        type: type,
        description: description,
        category_id: parseInt(categoryId),
        transaction_date: new Date().toISOString()
      };

      await api.post("/transactions", transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Transaction added!");

    } catch (error) {
      console.error(error);
      alert("Failed to add transaction");
    }
  };

  return (
    <div style={{padding:"40px"}}>

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

        <select value={type} onChange={(e)=>setType(e.target.value)}>
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

        <input
          type="number"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e)=>setCategoryId(e.target.value)}
          required
        />

        <br/><br/>

        <button type="submit">Add Transaction</button>

      </form>

    </div>
  );
}

export default Transactions;