import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import Rooms from "./components/Rooms";
import Tenants from "./components/Tenants";
import Booking from "./components/Booking";
import Signup from "./components/Signup";
import Login from "./components/Login";

import "./index.css";

// Create a theme
const theme = createTheme();

function App() {
  const user = localStorage.getItem("token");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {user && <Nav />}
        <Box component="main" sx={{ flexGrow: 1, p: 10, overflowY: "auto" }}>
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/bookings" element={<Booking />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
