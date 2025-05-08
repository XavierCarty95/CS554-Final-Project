import { Navigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useState, useEffect } from "react";

const ProtectedRoute = (props) => {

  const { children } = props;
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await axiosInstance.get("/verify");
        if (response.status === 200) {
          props.setIsLoggedIn(true);
        } else {
          props.setIsLoggedIn(false);
          props.setCurrentUser(null);
        }
      } catch {
        props.setIsLoggedIn(false);
        props.setCurrentUser(null);
      }
    };
    verifyLogin();
  }, []);
  if (props.isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }
  if (!props.isLoggedIn) {
    return (
      <div className="card">
        <h2>You are not logged in!</h2>
        <p>Please log in to access this page.</p>
        <Navigate to="/login" />
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
