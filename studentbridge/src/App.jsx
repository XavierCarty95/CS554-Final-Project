import { NavLink, Routes, Route } from "react-router-dom";
import "./App.css";
import "./tailwind.css";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ForumPage from "./components/Forum/ForumPage";
import ForumThread from "./components/Forum/ForumThread";
import NewThreadForm from "./components/Forum/NewThreadForm";
import UniversitySelection from "./components/University/UniversitySelection";
import UniversityProfile from "./components/University/UniversityProfile";
import About from "./components/About";
import Privacy from "./components/Privacy";
import Contact from "./components/Contact";
import ThreadDetailPage from "./components/Forum/ThreadDetailPage";

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/university/:universityid/forums">
          Forum
        </NavLink>
        <NavLink className="navlink" to="/login">
          login
        </NavLink>
        <NavLink className="navlink" to="/university">
          Universities
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

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
      </Routes>
    </div>
  );
}

export default App;
