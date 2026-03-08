import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"

import Dashboard from "./pages/dashboard"
import Login from "./pages/login"
import Transactions from "./pages/transactions"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/transactions"
          element={
            <Layout>
              <Transactions />
            </Layout>
          }
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App