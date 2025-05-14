/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Dashboard() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="max-w-6xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome to Student Bridge
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Connect, Learn, andx Thrive Together
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Universities</h2>
              <p className="text-gray-600 mb-4">
                Explore universities and their programs
              </p>
              <Link to="/university" className="text-blue-600 hover:underline">
                Browse all universities →
              </Link>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Professors</h2>
              <p className="text-gray-600 mb-4">
                Find professors and read their reviews
              </p>
              <p className="text-black-600">
                Select a university to view professors
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Courses</h2>
              <p className="text-gray-600 mb-4">
                Discover courses offered at universities
              </p>
              <Link to="/courses" className="text-blue-600 hover:underline">
                Browse all courses →
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
