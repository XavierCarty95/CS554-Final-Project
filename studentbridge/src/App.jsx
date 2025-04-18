import { NavLink, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Forum from "./components/Forum";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./tailwind.css";

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/forum">
          Forum
        </NavLink>

        <NavLink className="navlink" to="/login">
          login
        </NavLink>
      </nav>

      <Routes>z
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
