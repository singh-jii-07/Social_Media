import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { authHeader } from "../utils/authHeader";

const API = "http://localhost:5000/api/users";

function Profile() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const isOwnProfile = profile?._id === loggedInUser?._id;
  const isFollowing = profile?.followers?.includes(loggedInUser?._id);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!loggedInUser?._id) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API}/profile/${loggedInUser._id}`,
          { headers: authHeader() }
        );

        setProfile(res.data.user);
        setBio(res.data.user.bio || "");
        setGender(res.data.user.gender || "");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [loggedInUser]);

  /* ================= UPDATE PROFILE ================= */
  const updateProfileHandler = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("gender", gender);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const res = await axios.post(
        `${API}/profile/edit`,
        formData,
        {
          headers: authHeader(), // ❌ Content-Type MAT DO
        }
      );

      setProfile(res.data.user);

      // 🔥 sync localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...loggedInUser,
          bio: res.data.user.bio,
          gender: res.data.user.gender,
          profilePicture: res.data.user.profilePicture,
        })
      );

      toast.success("Profile updated successfully");
      setEditing(false);
    } catch {
      toast.error("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= FOLLOW / UNFOLLOW ================= */
  const followHandler = async () => {
    try {
      const res = await axios.post(
        `${API}/followorunfollow/${profile._id}`,
        {},
        { headers: authHeader() }
      );

      toast.success(res.data.message);

      setProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((id) => id !== loggedInUser._id)
          : [...prev.followers, loggedInUser._id],
      }));
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6">Profile not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* TOP */}
      <div className="flex items-center gap-10">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle size={120} className="text-gray-400" />
        )}

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">{profile.username}</h2>

            {!isOwnProfile && (
              <button
                onClick={followHandler}
                className={`px-4 py-1 rounded text-sm font-semibold ${
                  isFollowing
                    ? "bg-gray-200"
                    : "bg-blue-500 text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            {isOwnProfile && (
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-1 border rounded text-sm"
              >
                {editing ? "Close" : "Edit Profile"}
              </button>
            )}
          </div>

          <div className="flex gap-6 mt-4 text-sm">
            <span><b>{profile.posts?.length || 0}</b> posts</span>
            <span><b>{profile.followers?.length || 0}</b> followers</span>
            <span><b>{profile.following?.length || 0}</b> following</span>
          </div>

          <div className="mt-4 text-sm">
            <p>{profile.bio || "No bio added"}</p>
            {profile.gender && (
              <p className="text-gray-500">{profile.gender}</p>
            )}
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      {editing && (
        <div className="mt-6 border p-5 rounded-md bg-gray-50">
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full border px-3 py-2 mb-3 rounded"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            className="mb-4"
          />

          <button
            onClick={updateProfileHandler}
            disabled={saving}
            className={`px-4 py-2 rounded text-white ${
              saving
                ? "bg-blue-300"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
