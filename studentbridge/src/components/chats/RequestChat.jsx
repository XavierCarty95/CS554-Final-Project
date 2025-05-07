import { useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import ReactModal from "react-modal";
ReactModal.setAppElement("#root");

export default function RequestChat(props) {
  const [message, setMessage] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    const senderId = props.senderId;
    const receipentId = props.receipentId;

    // Perform the async operation outside the render cycle
    sendChatRequest(message, senderId, receipentId);
  };

  const sendChatRequest = async (message, senderId, receipentId) => {
    await axiosInstance
      .post("/chat/requestChat", {
        message: message,
        senderId: senderId,
        receipentId: receipentId,
      })
      .then((response) => {
        alert("Chat request sent successfully!");
        setMessage("");
        props.onClose();
      })
      .catch((error) => {
        console.error(
          "Error sending chat request:",
          error.response?.data.error || error.message
        );
        alert(
          `Error sending chat request: ${
            error.response?.data.error || error.message
          }`
        );
      });
  };

  return (
    <ReactModal
      isOpen={props.showRequestChat}
      onRequestClose={props.onClose}
      contentLabel="Request Chat Modal"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "none",
          background: "none",
          overflow: "visible",
          padding: "0",
        },
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Request a Chat</h2>
        <form
          id="requestChatForm"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            id="message"
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Send Request
          </button>
        </form>
        <button
          onClick={props.onClose}
          className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </ReactModal>
  );
}
