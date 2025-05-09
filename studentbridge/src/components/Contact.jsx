import React, { useState } from "react";
import axiosInstance from "../config/axiosConfig";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await axiosInstance.post("/contact", { message });
      setStatus("success");
      setMessage("");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-4 border rounded-lg mb-4 resize-none h-32 focus:ring-2 focus:ring-blue-400"
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>

        {status === "success" && (
          <p className="mt-4 text-green-600">Message sent successfully!</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-600">
            Something went wrong. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
}
