import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer bg-white py-10 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Student Bridge. All rights reserved.
        </p>
        <div className="links flex space-x-6">
          <NavLink to="/about" className="text-gray-500 hover:text-gray-800">
            About
          </NavLink>
          {/* <NavLink to="/contact" className="text-gray-500 hover:text-gray-800">
            Contact
          </NavLink> */}
          <NavLink to="/privacy" className="text-gray-500 hover:text-gray-800">
            Privacy Policy
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
