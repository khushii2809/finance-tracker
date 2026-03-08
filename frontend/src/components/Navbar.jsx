import { useState } from "react"

function Navbar(){

  const [dark, setDark] = useState(false)

  const toggleTheme = () => {

    document.body.classList.toggle("dark")

    setDark(!dark)

  }

  return(

    <div className="navbar">

      <h2>Finance Tracker</h2>

      <button onClick={toggleTheme}>
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

    </div>

  )

}

export default Navbar