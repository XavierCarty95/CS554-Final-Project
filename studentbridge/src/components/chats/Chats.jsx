// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import io from "socket.io-client";

export default function Chats() {
  const [activeTab, setActiveTab] = useState(null);
  const [chatRequests, setChatRequests] = useState([]);
  const [personalChatsList, setPersonalChatsList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [state, setState] = useState({
    message: "",
    name: "You",
  });
  const [chats, setChats] = useState({});
  const chatRefs = useRef({});
  const [groupChatsList, setGroupChatsList] = useState([]);
  const [userId, setUserId] = useState(null);

  const fetchChatRequests = async () => {
    try {
      const response = await axiosInstance.get("/chat/getChatRequests");
      if (response.status === 200) {
        setChatRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching chat requests:", error);
    }
  };

  const fetchPersonalChats = async () => {
    try {
      const response = await axiosInstance.get("/chat/listPersonalChats");
      if (response.status === 200) {
        setPersonalChatsList(response.data);
        if (response.data.length > 0) {
          setState({ message: "", name: response.data[0].senderName });
        }
      }
    } catch (error) {
      console.error("Error fetching personal chats:", error);
    }
  };

  const fetchGroupChats = async () => {
    try {
      const response = await axiosInstance.get("/chat/listGroupChats");
      if (response.status === 200) {
        setGroupChatsList(response.data);
        if (response.data.length > 0) {
          setState({ message: "", name: response.data[0].senderName });
        }
      }
    } catch (error) {
      console.error("Error fetching group chats:", error);
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (index === 2) fetchChatRequests();
    if (index === 0) fetchPersonalChats();
    if (index === 1) fetchGroupChats();
  };

  const handleChatSelect = (chat) => {
    if (chat.type === "group") {
      fetchGroupChats();
    } else if (chat.type === "personal") {
      fetchPersonalChats();
    }
    setChats((prevChats) => ({ ...prevChats, [chat._id]: chat.messages }));
    setSelectedChat(chat);
    if (!chatRefs.current[chat._id]) {
      const socket = io(import.meta.env.VITE_WS_URL || "http://localhost:3000");
      chatRefs.current[chat._id] = socket;

      socket.on("chatMessage", ({ name, message, chatId }) => {
        if (chatId === chat._id) {
          setChats((prevChats) => ({
            ...prevChats,
            [chatId]: [...(prevChats[chatId] || []), { name, message }],
          }));
        }
      });

      socket.emit("user_join", chat._id);
    }
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const msgEle = document.getElementById("message");
    const message = msgEle.value;

    if (message.trim() === "" || !selectedChat) return;

    const chatId = selectedChat._id;
    const socket = chatRefs.current[chatId];

    socket.emit("chatMessage", {
      name: state.name,
      message,
      chatId,
    });

    msgEle.value = "";
    msgEle.focus();
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axiosInstance.post("/chat/acceptChatRequest", {
        requestId,
      });
      if (response.status === 200) {
        setChatRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        fetchPersonalChats();
      }
    } catch (error) {
      console.error("Error accepting chat request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axiosInstance.post("/chat/rejectChatRequest", {
        requestId,
      });
      if (response.status === 200) {
        setChatRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error rejecting chat request:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r overflow-y-auto bg-white shadow-md">
        <div className="flex justify-center my-4">
          <button
            onClick={() => handleTabChange(0)}
            className={`px-4 py-2 mx-2 rounded ${
              activeTab === 0
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            Personal Chats
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`px-4 py-2 mx-2 rounded ${
              activeTab === 1
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => handleTabChange(2)}
            className={`px-4 py-2 mx-2 rounded ${
              activeTab === 2
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            Chat Requests
          </button>
        </div>
        <div>
          {activeTab === 0 && (
            <div className="overflow-y-auto max-h-full">
              {personalChatsList.length > 0 ? (
                personalChatsList.map((chat) => (
                  <div
                    key={chat._id}
                    className="border-b p-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleChatSelect(chat)}
                  >
                    <strong>{chat.name || "Unknown Chat"}</strong>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No personal chats available.
                </div>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div className="overflow-y-auto max-h-full">
              {groupChatsList.length > 0 ? (
                groupChatsList.map((chat) => (
                  <div
                    key={chat._id}
                    className="border-b p-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleChatSelect(chat)}
                  >
                    <strong>{chat.name || "Unknown Group"}</strong>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No group chats available.
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="overflow-y-auto max-h-full">
              {chatRequests.length > 0 ? (
                chatRequests.map((request) => (
                  <div
                    key={request._id}
                    className="border-b p-4 flex justify-between items-center hover:bg-gray-100"
                  >
                    <div>
                      <NavLink
                        to={`/profile/${request.senderId}`}
                        className="text-blue-500 hover:underline"
                      >
                        <strong>{request.sender.name}</strong>
                      </NavLink>
                      : {request.message}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No chat requests available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-white shadow-md">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">
                Chat with {selectedChat.name || "Unknown"}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {(chats[selectedChat._id] || []).map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.name}: </strong>
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex items-center space-x-2">
              <form className="chatform" onSubmit={onMessageSubmit}>
                <input
                  name="message"
                  id="message"
                  placeholder="Type a message..."
                  className="flex-1 border rounded px-4 py-2 focus:ring focus:ring-blue-300"
                  autoFocus
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to view messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
