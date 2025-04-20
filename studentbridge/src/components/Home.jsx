import React from "react";
import SearchBar from "./SearchBar";
import { NavLink } from "react-router-dom";
import { University, MessageCircle, Calendar } from "lucide-react";

const features = [
  {
    title: "Find Your Community",
    description: "Search and join your university’s discussion forum.",
    icon: <University size={48} className="text-blue-500 mb-4" />,
  },
  {
    title: "Ask & Answer",
    description: "Post threads, share resources, and get peer support.",
    icon: <MessageCircle size={48} className="text-blue-500 mb-4" />,
  },
  {
    title: "Events & Resources",
    description:
      "Discover student-run events, study materials, and mentorship opportunities.",
    icon: <Calendar size={48} className="text-blue-500 mb-4" />,
  },
];

function Home() {
  return (
    <main className="flex flex-col">
      <section className="hero-banner relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Welcome to Student Bridge
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Connect, Learn, and Thrive Together in Your Academic Journey
          </p>
          <NavLink
            to="/signup"
            className="btn-primary bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign Up Now!!
          </NavLink>
        </div>
      </section>

      <section className="features-grid bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-card bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
              >
                <div>{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer bg-white py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
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

export default Home;
