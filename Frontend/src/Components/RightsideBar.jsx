import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { authHeader } from "../utils/authHeader";

const API = "http://localhost:5000/api/users";

function RightSideBar() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${API}/suggested`, {
          headers: authHeader(),
        });
        setUsers(res.data.users || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  /* ================= FOLLOW / UNFOLLOW ================= */
  const handleFollowUnfollow = async (userId) => {
    try {
      const res = await axios.post(
        `${API}/followorunfollow/${userId}`,
        {},
        { headers: authHeader() }
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u._id === userId) {
              const isFollowing = u.followers.includes(loggedInUser._id);

              return {
                ...u,
                followers: isFollowing
                  ? u.followers.filter(
                      (id) => id !== loggedInUser._id
                    )
                  : [...u.followers, loggedInUser._id],
              };
            }
            return u;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-72 px-4 py-6 hidden lg:block">
      {/* TITLE */}
      <h2 className="font-semibold text-sm text-gray-500 mb-4">
        Suggested for you
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-400">
          Loading suggestions...
        </p>
      )}

      {/* EMPTY */}
      {!loading && users.length === 0 && (
        <p className="text-sm text-gray-400">
          No suggestions
        </p>
      )}

      {/* USERS */}
      <div className="space-y-4">
        {users.map((user) => {
          const isFollowing = user.followers?.includes(
            loggedInUser._id
          );

          return (
            <div
              key={user._id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FaUserCircle
                  size={32}
                  className="text-gray-400"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    Suggested for you
                  </p>
                </div>
              </div>

              {/* FOLLOW / UNFOLLOW */}
              <button
                onClick={() => handleFollowUnfollow(user._id)}
                className={`text-sm font-semibold ${
                  isFollowing
                    ? "text-gray-500 hover:text-black"
                    : "text-blue-500 hover:text-blue-700"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RightSideBar;
