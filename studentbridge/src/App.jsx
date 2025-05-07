import { NavLink, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import "./tailwind.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ForumPage from "./components/Forum/ForumPage";
import UniversitySelection from "./components/University/UniversitySelection";
import UniversityProfile from "./components/University/UniversityProfile";
import About from "./components/About";
import Privacy from "./components/Privacy";

import ProfessorsPage from "./components/Professor/ProfessorsPage";
import Contact from "./components/Contact";
import ThreadDetailPage from "./components/Forum/ThreadDetailPage";
import Logout from "./components/Logout";
import axiosInstance from "./config/axiosConfig";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfessorDetailPage from "./components/Professor/ProfessorDetail";
import Profile from "./components/Profile/ProfilePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await axiosInstance
          .get("/verify")
          .then((response) => {
            if (response.status === 200) {
              setIsLoggedIn(true);
              setCurrentUser(response.data); // store user info
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            setIsLoggedIn(false);
            setCurrentUser(null);
          });
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };
    verifyLogin();
  }, [currentUser, isLoggedIn]);

  return (
    <div className="App">
      <nav className="navbar">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        {/* <NavLink className="navlink" to="/university/:universityid/forums">
          Forum
        </NavLink> */}
        <NavLink className="navlink" to="/login">
          login
        </NavLink>
        <NavLink className="navlink" to="/university">
          Universities
        </NavLink>
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
        {isLoggedIn && currentUser && (
          <div className="navlink-container">
            <NavLink className="navlink" to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className="navlink" to="/university">
              Universities
            </NavLink>
            <NavLink className="navlink" to={`/profile/${currentUser._id}`}>
              Profile
            </NavLink>
            <NavLink className="navlink" to="/logout">
              Logout
            </NavLink>
            <NavLink className="navlink" to="/university">
              Universities
            </NavLink>
            <NavLink className="navlink" to="/logout">
              Logout
            </NavLink>
            <NavLink className="navlink" to={`/profile/${currentUser._id}`}>
              Profile
            </NavLink>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            />
          }
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
          path="/university/:universityId/professors"
          element={<ProfessorsPage />}
        />
        <Route
          path="/university/:universityId/professors/:professorId"
          element={<ProfessorDetailPage />}
        />
  path="/university/:universityId/professors"
  element={<ProfessorsPage />}
/>
<Route path="/university/:universityId/professors/:professorId" element={<ProfessorDetailPage />} />
        <Route
          path="/university/:universityId/forums"
          element={<ForumPage />}
        />
        <Route
          path="/university/:universityId/forums/:forumId"
          element={<ThreadDetailPage />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/logout"
          element={
            <Logout
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
