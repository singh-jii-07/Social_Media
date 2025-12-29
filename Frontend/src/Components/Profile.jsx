import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisH, FaCamera, FaBookmark } from "react-icons/fa";

const USER_API = "http://localhost:5000/api/users";
const POST_API = "http://localhost:5000/api/post";

const Profile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("posts");

  // edit states
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [updating, setUpdating] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${USER_API}/profile/${loggedInUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data.user);
        setBio(res.data.user.bio || "");
        setGender(res.data.user.gender || "");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `${POST_API}/getpostuser/${loggedInUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      } finally {
        setPostLoading(false);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const res = await axios.get(
          `${POST_API}/bookmark/${loggedInUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      } finally {
        setSavedLoading(false);
      }
    };

    fetchProfile();
    fetchUserPosts();
    fetchSavedPosts();
  }, []);

  /* ================= FOLLOW / UNFOLLOW ================= */
  const isOwnProfile = loggedInUser._id === user?._id;
  const isFollowing = user?.followers?.includes(loggedInUser._id);

  const handleFollowUnfollow = async () => {
    try {
      const res = await axios.post(
        `${USER_API}/followorunfollow/${user._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUser((prev) => {
          if (isFollowing) {
            return {
              ...prev,
              followers: prev.followers.filter(
                (id) => id !== loggedInUser._id
              ),
            };
          } else {
            return {
              ...prev,
              followers: [...prev.followers, loggedInUser._id],
            };
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be less than 5MB");
      return;
    }
    setProfilePhoto(file);
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("gender", gender);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await axios.post(`${USER_API}/profile/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.log(err);
      alert("Profile update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">Profile not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* ================= TOP ================= */}
      <div className="flex gap-10 items-center">
        <div className="relative">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-36 h-36 rounded-full object-cover border"
          />
          {editing && (
            <label className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full cursor-pointer">
              <FaCamera className="text-white" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{user.username}</h2>

            {/* BUTTON */}
            {isOwnProfile ? (
              !editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-1 border rounded-md text-sm"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              )
            ) : (
              <button
                onClick={handleFollowUnfollow}
                className={`px-4 py-1 rounded-md text-sm font-medium ${
                  isFollowing
                    ? "border text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            <FaEllipsisH />
          </div>

          <div className="flex gap-6 mt-4">
            <p><b>{posts.length}</b> posts</p>
            <p><b>{user.followers?.length || 0}</b> followers</p>
            <p><b>{user.following?.length || 0}</b> following</p>
          </div>

          <div className="mt-4 text-sm">
            <p className="font-semibold">{user.name}</p>
            {!editing ? (
              <>
                <p>{user.bio || "No bio added yet"}</p>
                {user.gender && (
                  <p className="text-gray-500 capitalize">{user.gender}</p>
                )}
              </>
            ) : (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border p-2 mt-2"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border p-2 mt-2"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex justify-center gap-10 mt-10 border-t pt-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("posts")}
          className={activeTab === "posts" ? "border-b-2 border-black" : ""}
        >
          POSTS
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={activeTab === "saved" ? "border-b-2 border-black" : ""}
        >
          <FaBookmark className="inline mr-1" /> SAVED
        </button>
      </div>

      {/* ================= POSTS / SAVED ================= */}
      <div className="mt-6">
        {activeTab === "posts" &&
          (postLoading ? (
            <p className="text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center">No posts yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <img
                  key={post._id}
                  src={post.image}
                  className="aspect-square object-cover"
                />
              ))}
            </div>
          ))}

        {activeTab === "saved" &&
          (savedLoading ? (
            <p className="text-center">Loading saved posts...</p>
          ) : savedPosts.length === 0 ? (
            <p className="text-center">No saved posts</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <img
                  key={post._id}
                  src={post.image}
                  className="aspect-square object-cover"
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
