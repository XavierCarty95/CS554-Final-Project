// src/components/University/UniversityProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import io from "socket.io-client";

const UniversityProfile = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [state, setState] = useState({
    message: "",
    name: "You",
  });
  const [chats, setChats] = useState({});
  const chatRefs = useRef({});
  const socketRef = useRef(null);
  const [publicChatId, setChatId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/verify");
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            name: response.data.name || "You",
          }));
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/universities/${universityId}`)
      .then((response) => {
        setUniversity(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching university details:", err);
        setError(
          err.response?.data?.error || "Failed to load university details"
        );
        setIsLoading(false);
      });
  }, [universityId]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    // Emit a "join" event for the specific university chat room
    socketRef.current.emit("user_join", publicChatId);

    // Define the chat message handler
    const handleChatMessage = ({ name, message, chatId }) => {
      if (chatId === publicChatId) {
        setChats((prevChats) => ({
          ...prevChats,
          [chatId]: [...(prevChats[chatId] || []), { name, message }],
        }));
      }
    };

    // Register the listener
    socketRef.current.on("chatMessage", handleChatMessage);

    // Cleanup: Remove the listener and disconnect the socket
    return () => {
      socketRef.current.off("chatMessage", handleChatMessage); // Remove the listener
      socketRef.current.emit("leave", publicChatId); // Emit leave event
      socketRef.current.disconnect(); // Disconnect the socket
    };
  }, [publicChatId]);

  useEffect(() => {
    const fetchPublicChat = async () => {
      try {
        const response = await axiosInstance.get(
          `/chat/getPublicChat/${universityId}`
        );
        if (response.status === 200) {
          setChatId(response.data._id);
          setChats((prevChats) => ({
            ...prevChats,
            [response.data._id]: response.data.messages,
          }));
        }
      } catch (error) {
        console.error("Error fetching public chat:", error);
      }
    };

    fetchPublicChat();
  }, [universityId]);

  const navigateToForums = () => {
    navigate(`/university/${universityId}/forums`);
  };

  if (isLoading)
    return <div className="text-center p-4">Loading university details...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!university)
    return <div className="text-center p-4">University not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{university.name}</h2>
      <p className="text-gray-600 mb-6">{university.location}</p>

      {university.overview && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="text-gray-700">{university.overview}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
          <ul className="space-y-2">
            <li>Professors: {university.professors?.length || 0}</li>
            <li>Courses: {university.courses?.length || 0}</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <div className="space-y-3">
            <button
              onClick={navigateToForums}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Discussion Forums
            </button>
            <button
              onClick={() => navigate(`/university/${universityId}/professors`)}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Rate My Professors
            </button>
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white shadow-sm w-full col-span-2">
          <h3 className="text-lg font-semibold mb-3">Chat Room</h3>
          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
            style={{ height: "300px" }}
            ref={(el) => (chatRefs.current[universityId] = el)}
          >
            {(chats[publicChatId] || []).map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.name}: </strong>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex items-center space-x-2">
            <form
              className="chatform"
              onSubmit={(e) => {
                e.preventDefault();
                if (state.message.trim()) {
                  const newMessage = {
                    name: state.name,
                    message: state.message,
                    chatId: publicChatId,
                  };
                  socketRef.current.emit("chatMessage", newMessage);
                  setState((prevState) => ({ ...prevState, message: "" }));
                }
              }}
            >
              <input
                name="message"
                id="message"
                value={state.message}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    message: e.target.value,
                  }))
                }
                placeholder="Type a message..."
                className="flex-1 border rounded px-4 py-2 focus:ring focus:ring-blue-300"
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;
