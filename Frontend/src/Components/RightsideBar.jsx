import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { authHeader } from "../utils/authHeader";

const API = "http://localhost:5000/api/users";

function RightSideBar() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${API}/suggested`,
          { headers: authHeader() }
        );
        setUsers(res.data.users || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="w-72 px-4 py-6 hidden lg:block">

      {/* TITLE */}
      <h2 className="font-semibold text-sm text-gray-500 mb-4">
        Suggested for you
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-400">Loading suggestions...</p>
      )}

      {/* USERS */}
      {!loading && users.length === 0 && (
        <p className="text-sm text-gray-400">No suggestions</p>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FaUserCircle size={32} className="text-gray-400" />
              <div>
                <p className="text-sm font-semibold">
                  {user.username}
                </p>
                <p className="text-xs text-gray-400">
                  Suggested for you
                </p>
              </div>
            </div>

            {/* FOLLOW BUTTON (UI ONLY) */}
            <button
              className="text-blue-500 text-sm font-semibold hover:text-blue-700"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightSideBar;
