import { NavLink } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useEffect } from "react";

function Logout(props) {
  const handleLogout = () => {
    try {
      const logoutUser = axiosInstance.get("/logout");
      if (logoutUser.status === 200) {
        localStorage.removeItem("Cookie");
      }
      props.setIsLoggedIn(false);
      return true;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        You have been logged out!
      </h2>
      <p className="text-gray-600 mb-6">Thank you for using our service.</p>
      <div className="flex space-x-4">
        <NavLink
          to="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Login Again
        </NavLink>
        <NavLink
          to="/"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Home
        </NavLink>
      </div>
    </div>
  );
}
export default Logout;
