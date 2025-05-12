import { Navigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useState, useEffect } from "react";

const ProtectedRoute = (props) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await axiosInstance.get("/verify");
        if (response.status === 200) {
          props.setIsLoggedIn(true);
          props.setCurrentUser(response.data);
        } else {
          props.setIsLoggedIn(false);
          props.setCurrentUser(null);
        }
      } catch {
        props.setIsLoggedIn(false);
        props.setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyLogin();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!props.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
