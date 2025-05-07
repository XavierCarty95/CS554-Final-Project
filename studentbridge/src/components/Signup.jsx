import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

function Signup(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    university: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [universities, setUniversities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("/universities/getUniversityDropdown");
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setErrorMessage("Failed to load universities. Please try again.");
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage("");
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      return;
    }
    const user = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      universityId: formData.university,
    };

    axios
      .post("/signup", user)
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        alert("Signup successful! Redirecting to login page...");
        props.setIsLoggedIn(true);
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log(error.response)
        console.error("Signup failed:", error.response?.data || error.message);
        setErrorMessage("Signup failed: " + error.response?.data.error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Signup
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled hidden>
                Select your role
              </option>
              <option value="student">Student</option>
              <option value="incoming">Incoming Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          {formData.role === "student" || formData.role === "professor" ? (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                University Name
              </label>
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled hidden>
                  Select your university
                </option>
                {universities.map((universityMap) => (
                  <option key={universityMap._id} value={universityMap._id}>
                    {universityMap.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Signup
          </button>
          {errorMessage && (
            <div className="mb-4 text-sm text-red-600">{errorMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Signup;
