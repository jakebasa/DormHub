import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider and createTheme
import Box from "@mui/material/Box";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import Rooms from "./components/Rooms";
import Tenants from "./components/Tenants";
import Booking from "./components/Booking";
import Signup from "./components/Signup";
import "./index.css";

// Create a theme
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Nav />
        <Box component="main" sx={{ flexGrow: 1, p: 10, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/bookings" element={<Booking />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
