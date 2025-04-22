import React from "react";
import SearchBar from "./SearchBar";
import { NavLink, Routes, Route } from "react-router-dom";

function Dashboard() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Student Bridge
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Connect, Learn, and Thrive Together
          </p>
          <div className="max-w-md mx-auto mb-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <footer className="footer bg-white py-10 mt-auto ">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center ">
          <p className="text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Student Bridge. All rights
            reserved.
          </p>
          <div className="links flex space-x-6">
            <NavLink to="/about" className="text-gray-500 hover:text-gray-800">
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="text-gray-500 hover:text-gray-800"
            >
              Contact
            </NavLink>
            <NavLink
              to="/privacy"
              className="text-gray-500 hover:text-gray-800"
            >
              Privacy Policy
            </NavLink>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Dashboard;
