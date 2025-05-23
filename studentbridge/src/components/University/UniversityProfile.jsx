import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import io from "socket.io-client";
import Footer from "../Footer";

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
  const [showGroup, setShowGroup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/verify");
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            name: response.data.name || "You",
            senderId: response.data._id,
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
    socketRef.current = io(
      import.meta.env.VITE_WS_URL || "http://localhost:3000"
    );

    socketRef.current.emit("user_join", publicChatId);

    const handleChatMessage = ({ name, message, chatId, senderId }) => {
      if (chatId === publicChatId) {
        setChats((prevChats) => ({
          ...prevChats,
          [chatId]: [...(prevChats[chatId] || []), { name, message, senderId }],
        }));
      }
    };

    socketRef.current.on("chatMessage", handleChatMessage);

    return () => {
      socketRef.current.off("chatMessage", handleChatMessage);
      socketRef.current.emit("leave", publicChatId);
      socketRef.current.disconnect();
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

  useEffect(() => {
    const checkIfStudent = async () => {
      try {
        const response = await axiosInstance.get(
          `/university/${universityId}/groups/isStudent`
        );
        if (response.status === 200) {
          setShowGroup(response.data.isStudent);
        }
      } catch (error) {
        console.error("Error checking if user is a student:", error);
      }
    };

    checkIfStudent();
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
    <div className="flex flex-col min-h-screen bg-gray-100">
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
          {/* In UniversityProfile.jsx - Add this to the Resources section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Resources</h2>
            <div className="space-y-3">
              <button
                onClick={navigateToForums}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Discussion Forums
              </button>
              <Link
                to={`/university/${universityId}/professors`}
                className="block w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
              >
                View Professors
              </Link>
              <Link
                to={`/university/${universityId}/courses`}
                className="block w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
              >
                View Courses
              </Link>
            </div>
          </div>
          {showGroup && (
            <div className="border rounded-lg p-4 bg-white shadow-sm col-span-2">
              <h3 className="text-lg font-semibold mb-3">
                Looking for Groups?
              </h3>
              <button
                onClick={() => navigate(`/university/${universityId}/groups/`)}
                className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Browse Groups
              </button>
            </div>
          )}
          <div className="border rounded-lg p-4 bg-white shadow-sm w-full col-span-2">
            <h3 className="text-lg font-semibold mb-3">Chat Room</h3>
            <div
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
              style={{ height: "300px" }}
              ref={(el) => (chatRefs.current[universityId] = el)}
            >
              {(chats[publicChatId] || []).map((msg, index) => (
                <div key={index} className="mb-2">
                  <Link to={`/profile/${msg.senderId}`}>
                    <strong>{msg.name}: </strong>
                  </Link>
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
                      senderId: state.senderId,
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
      <Footer />
    </div>
  );
};

export default UniversityProfile;
