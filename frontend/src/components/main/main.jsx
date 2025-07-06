import React from "react";
import { Box } from "@mui/material";
import Header from "../common/Header";
import Navbar from "../common/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";

import Test from "../pages/Test";
import Qna from "../pages/Qna";
import Home from "../pages/Home";
import LoginPage from "../auth/LoginPage";
import Exam from "../pages/Exam";
import Result from "../pages/Result";
import CourseList from "../pages/CourseList";
import CourseDetail from "../pages/CourseDetail";

export default function Main() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "background.default",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/courselist" element={<CourseList  />} />
          <Route path="/coursedetail/:courseId" element={<CourseDetail  />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/result" element={<Result />} />
          <Route path="/login" element={<LoginPage initialIsLogin={true} />} />
          <Route path="/register" element={<LoginPage initialIsLogin={false} />} />
        </Routes>
      </Box>
    </Box>
  );
}