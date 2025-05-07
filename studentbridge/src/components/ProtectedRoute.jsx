import { Navigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await axiosInstance.get("/verify");
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    verifyLogin();
  }, []);
  if (isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }
  if (!isLoggedIn) {
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
