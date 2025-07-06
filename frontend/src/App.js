import React, { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Main from "./components/main/main";
import Dashboard from "./dashboard/Dashboard";
import Settings from "./components/routes/Settings"
import MyCourses from "./components/routes/MyCourses"
import UserProfile from "./components/routes/UserProfile"
import AdminRoute from "./components/routes/AdminRoute";
import TeacherRoute from "./components/routes/TeacherRoute";
import MainTeacher from "./teacher/main"

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f5f7fa", paper: "#fff" },
    primary: { main: "#4a90e2", contrastText: "#fff" },
    secondary: { main: "#d81b60", contrastText: "#fff" },
    text: { primary: "#222", secondary: "#555" },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  shape: { borderRadius: 12 },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1d1d1d" },
    primary: { main: "#90caf9", contrastText: "#000" },
    secondary: { main: "#f48fb1", contrastText: "#000" },
    text: { primary: "#eee", secondary: "#aaa" },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  shape: { borderRadius: 12 },
});

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const handleUnload = () => {
      const url = "http://localhost:4000/api/auth/logout";
      const data = new Blob([], { type: "application/json" });
      navigator.sendBeacon(url, data);
    };

    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>

            {/* Teacher routes */}
            <Route element={<TeacherRoute />}>
              <Route path="/main_teacher/*" element={<MainTeacher />} />
            </Route>
            
            {/* Main routes */}
            <Route
              path="/*"
              element={<Main darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            />
            
            {/* Other routes */}
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/mycourses" element={<MyCourses />} />
            <Route path="/" element={<Navigate to="/main" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}