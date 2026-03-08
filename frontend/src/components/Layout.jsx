import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box>

      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Finance Tracker
          </Typography>

          <Button color="inherit" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>

          <Button color="inherit" onClick={() => navigate("/transactions")}>
            Transactions
          </Button>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>

        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4 }}>
        {children}
      </Box>

    </Box>
  );
}