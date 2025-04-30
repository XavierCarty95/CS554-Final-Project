import React, { useState, useRef, useEffect } from "react";
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const [unisRes, profsRes] = await Promise.all([
          axios.get(`/universities/search?q=${encodeURIComponent(query)}`),
          axios.get(`/professors/search?q=${encodeURIComponent(query)}`),
        ]);
        const uniSuggestions = unisRes.data.map((u) => ({
          id: u.id,
          name: u.name,
          type: "university",
        }));
        const profSuggestions = profsRes.data.map((p) => ({
          id: p.id,
          name: p.name,
          type: "professor",
        }));
        setSuggestions([...uniSuggestions, ...profSuggestions]);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load suggestions.");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelect = (item) => {
    setQuery(item.name);
    setSuggestions([]);
    if (item.type === "university") {
      navigate(`/university/${item.id}`);
    } else if (item.type === "professor") {
      navigate(`/professors/${item.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 text-center">
      <p className="text-2xl md:text-4xl font-bold mb-4">
        Enter Your School or Professor name
      </p>

      <div className="relative w-full" ref={dropdownRef}>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search for your university or professor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && (
          <div className="absolute right-2 top-3 text-gray-500">Loading...</div>
        )}
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white w-full mt-1 border rounded-lg max-h-60 overflow-auto shadow">
            {suggestions.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center"
                onClick={() => onSelect(item)}
              >
                <span className="mr-2">
                  {item.type === "university" ? "🏫" : "👩‍🏫"}
                </span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
