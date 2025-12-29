import React, { useEffect, useState } from "react";
import socket from "./Socket";
import axios from "axios";

const Messages = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);

  if (!selectedUser || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat
      </div>
    );
  }

  // 🔥 Socket listener
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (
        newMessage.sender === selectedUser._id ||
        newMessage.receiver === selectedUser._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser._id]);

  // 🔥 Fetch messages on chat change
  useEffect(() => {
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
  }, [selectedUser._id]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {messages.length === 0 ? (
        <p className="text-center text-gray-400">No messages yet</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender === currentUser._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-md max-w-[70%] text-sm ${
                msg.sender === currentUser._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
