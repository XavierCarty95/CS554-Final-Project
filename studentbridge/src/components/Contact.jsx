import React, { useState } from "react";

export default function Contact() {
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up to your backend or service
    alert("Thanks for reaching out!");
    setMessage("");
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
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
