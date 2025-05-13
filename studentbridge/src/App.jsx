import { NavLink, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
// import "./App.css";
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
import Chats from "./components/chats/Chats.jsx";
import CourseList from "./components/Courses/CourseList";
import CourseDetail from "./components/Courses/CourseDetail";
import AddCourse from "./components/Courses/AddCourse";
import CoursePlan from "./components/Courses/CoursePlan";
import UniversityCourses from "./components/University/UniversityCourses.jsx";
import GroupList from "./components/groups/GroupList.jsx";
import GroupPage from "./components/groups/GroupPage.jsx";

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
              setCurrentUser(response.data);
            }
          })
          .catch(() => {
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
  }, []); // Remove isLoggedIn from here

  return (
    <div className="App">
      <nav className="navbar">
        <NavLink className="navlink" to="/">
          Home
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
            <NavLink className={"navlink"} to="/chats">
              Chats
            </NavLink>
            <NavLink className="navlink" to={`/profile/${currentUser._id}`}>
              Profile
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
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <UniversitySelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <UniversityProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/professors"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <ProfessorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/professors/:professorId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <ProfessorDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professors/:professorId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <ProfessorDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/forums"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <ForumPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/forums/:forumId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <ThreadDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduler"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <CoursePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <CourseDetail />
            </ProtectedRoute>
          }
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
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-course"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <AddCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-plan"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <CoursePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/courses"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <UniversityCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/groups"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <GroupList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/:universityId/groups/:groupId"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            >
              <GroupPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
