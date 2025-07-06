import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function TeacherRoute() {
  const { user, isTeacher, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isTeacher && !isAdmin) {
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
}