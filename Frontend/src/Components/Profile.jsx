import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisH, FaCamera } from "react-icons/fa";

const USER_API = "http://localhost:5000/api/users";
const POST_API = "http://localhost:5000/api/post";

const Profile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);

  // edit states
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [updating, setUpdating] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${USER_API}/profile/${loggedInUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      } finally {
        setPostLoading(false);
      }
    };

    fetchProfile();
    fetchUserPosts();
  }, []);

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

      const res = await axios.post(
        `${USER_API}/profile/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      setEditing(false);
      alert("Profile updated successfully");
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
      {/* ================= TOP SECTION ================= */}
      <div className="flex gap-10 items-center">
        {/* PROFILE IMAGE */}
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
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* USER INFO */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{user.username}</h2>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-1 border rounded-md text-sm font-medium"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm font-medium"
              >
                {updating ? "Saving..." : "Save"}
              </button>
            )}

            <FaEllipsisH />
          </div>

          {/* STATS */}
          <div className="flex gap-6 mt-4">
            <p><span className="font-semibold">{posts.length}</span> posts</p>
            <p><span className="font-semibold">{user.followers?.length || 0}</span> followers</p>
            <p><span className="font-semibold">{user.following?.length || 0}</span> following</p>
          </div>

          {/* BIO */}
          <div className="mt-4 text-sm">
            <p className="font-semibold capitalize">{user.name}</p>

            {!editing ? (
              <>
                <p className="font-medium">{user.bio || "No bio added yet"}</p>
                {user.gender && (
                  <p className="text-gray-600 capitalize">{user.gender}</p>
                )}
              </>
            ) : (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full mt-2 p-2 border rounded-md"
                  placeholder="Write your bio..."
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-2 p-2 border rounded-md"
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

      {/* ================= POSTS GRID ================= */}
      <div className="mt-12 border-t pt-6">
        <h3 className="text-center text-sm font-semibold tracking-widest mb-6">
          POSTS
        </h3>

        {postLoading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div key={post._id} className="relative group aspect-square">
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white text-sm">
                  <span>❤️ {post.likes.length}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
