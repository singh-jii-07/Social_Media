import React, { useEffect, useState } from "react";
import axios from "axios";

const Messages = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/message/all/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  return (
    <div className="flex-1 flex flex-col">
      {/* CHAT HEADER */}
      <div className="px-4 py-2 border-b font-medium">
        {selectedUser?.username}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender === currentUser?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-md max-w-[70%] text-sm ${
                msg.sender === currentUser?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
