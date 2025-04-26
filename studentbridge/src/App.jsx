import { NavLink, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import "./tailwind.css";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ForumPage from "./components/Forum/ForumPage";
// import ForumThread from "./components/Forum/ForumThread";
// import NewThreadForm from "./components/Forum/NewThreadForm";
import UniversitySelection from "./components/University/UniversitySelection";
import UniversityProfile from "./components/University/UniversityProfile";
import About from "./components/About";
import Privacy from "./components/Privacy";
import Contact from "./components/Contact";
import ThreadDetailPage from "./components/Forum/ThreadDetailPage";
import Logout from "./components/Logout";
import axiosInstance from "./config/axiosConfig";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await axiosInstance
          .get("/verify")
          .then((response) => {
            if (response.status === 200) {
              setIsLoggedIn(true);
            }
          })
          .catch((error) => {
            setIsLoggedIn(false);
          });
      } catch (error) {
        console.error("Error verifying login:", error);
        setIsLoggedIn(false);
      }
    };
    verifyLogin();
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        {/* <NavLink className="navlink" to="/university/:universityid/forums">
          Forum
        </NavLink> */}
        {!isLoggedIn && (
          <div className="navlink-container">
            <NavLink className="navlink" to="/login">
              Login
            </NavLink>

            <NavLink className="navlink" to="/signup">
              Sign Up
            </NavLink>
          </div>
        )}

        {isLoggedIn && (
          <div className="navlink-container">
            <NavLink className="navlink" to="/university">
              Universities
            </NavLink>

            <NavLink className="navlink" to="/logout">
              Logout
            </NavLink>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/university" element={<UniversitySelection />} />
        <Route
          path="/university/:universityId"
          element={<UniversityProfile />}
        />
        <Route
          path="/university/:universityId/forums"
          element={<ForumPage />}
        />
        <Route
          path="/university/:universityId/forums/:forumId"
          element={<ThreadDetailPage />}
        />
        {/* <Route
          path="/university/:universityId/forums/:id"
          element={<ForumThread />}
        /> */}
        {/* <Route
          path="/university/:universityId/forums/new"
          element={<NewThreadForm />}
        /> */}
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/logout"
          element={<Logout setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </div>
  );
}

export default App;
