import { NavLink, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ForumPage from "./components/Forum/ForumPage";
import ForumThread from "./components/Forum/ForumThread";
import NewThreadForm from "./components/Forum/NewThreadForm";

function App() {
  return (
    <>
      <nav className="center">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/university/:universityid/forum">
          Forum
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
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
    </>
  );
}

export default App;
