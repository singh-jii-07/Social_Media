import React, { useState } from "react";
import { useSelector } from "react-redux";
import Messages from "./Message";
import axios from "axios";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [textMessage, setTextMessage] = useState("");

  const { user, suggestedUsers } = useSelector((store) => store.auth);

  const sendMessageHandler = async () => {
    if (!textMessage.trim() || !selectedUser) return;

    try {
      await axios.post(
        `http://localhost:5000/api/message/send/${selectedUser._id}`,
        { textMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTextMessage("");
      // Messages component automatically reload karega
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT USER LIST */}
      <div className="w-1/4 border-r">
        <div className="p-4 font-semibold border-b">{user?.username}</div>

        <div className="overflow-y-auto">
          {suggestedUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)} // 👈 HERE
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === u._id ? "bg-gray-200" : ""
              }`}
            >
              {u.username}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b font-medium">
            {selectedUser.username}
          </div>

          <Messages selectedUser={selectedUser} currentUser={user} />

          <div className="p-3 border-t flex gap-2">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-2 outline-none"
            />
            <button
              onClick={sendMessageHandler}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a user to start chat
        </div>
      )}
    </div>
  );
};

export default ChatPage;
