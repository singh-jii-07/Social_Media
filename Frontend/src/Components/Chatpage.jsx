import React, { useEffect, useState } from "react";
import axios from "axios";
import Messages from "./Message";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);

  // ✅ user redux se nahi, localStorage se
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH FOLLOWING USERS ================= */
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/following",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          setFollowingUsers(res.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowingUsers();
  }, []);

  /* ================= SEND MESSAGE ================= */
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
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Please login
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* LEFT CHAT LIST */}
      <div className="w-1/4 border-r">
        <div className="p-4 font-semibold border-b">Chats</div>

        <div className="overflow-y-auto">
          {followingUsers.length === 0 && (
            <p className="text-center text-gray-400 mt-4">
              Follow someone to start chat
            </p>
          )}

          {followingUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
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
              onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
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
          Select a chat
        </div>
      )}
    </div>
  );
};

export default ChatPage;
