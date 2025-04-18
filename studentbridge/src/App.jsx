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

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/university/:universityid/forum">
          Forum
        </NavLink>
        <NavLink className="navlink" to="/login">
          login
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/university/:universityId/forum" element={<ForumPage />} />
        <Route
          path="/university/:universityId/forum/:id"
          element={<ForumThread />}
        />
        <Route
          path="/university/:universityId/forum/new"
          element={<NewThreadForm />}
        />
      </Routes>
    </div>
  );
}

export default App;
