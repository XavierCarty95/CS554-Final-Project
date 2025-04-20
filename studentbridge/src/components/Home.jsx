import React from "react";
import SearchBar from "./SearchBar";
import { NavLink, Routes, Route } from "react-router-dom";





function Home() { 
    return (
        <>
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Student Bridge</h1>
                    <p className="text-xl mb-8 text-gray-600">Connect, Learn, and Thrive Together</p>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">Enter Your schhol</h2>
                    <div className="max-w-md mx-auto mb-8">
                        <SearchBar />
                    </div>
                </div>
            </section>
            <footer className="bg-white py-8 border-t">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600">&copy; {new Date().getFullYear()} Student Bridge. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <NavLink to="/about" className="text-gray-600 hover:text-gray-800">About</NavLink>
                        <NavLink to="/contact" className="text-gray-600 hover:text-gray-800">Contact</NavLink>
                        <NavLink to="/privacy" className="text-gray-600 hover:text-gray-800">Privacy</NavLink>
                    </div>
                </div>
            </footer>
           
            
        </>
    )
}

export default Home