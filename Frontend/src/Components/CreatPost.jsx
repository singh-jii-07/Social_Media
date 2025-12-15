import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authHeader } from "../utils/authHeader";

const API = "http://localhost:5000/api/post";

function CreatPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // image select
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // submit post
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image); // 🔥 same name as multer

      const res = await axios.post(
        `${API}/addpost`,
        formData,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Post created successfully");
        navigate("/"); // home page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>

      <form onSubmit={submitHandler} className="space-y-4">

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-64 object-cover rounded"
          />
        )}

        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          onChange={imageHandler}
          className="w-full"
        />

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded p-2 resize-none"
          rows={3}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded
                     hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Posting..." : "Share"}
        </button>
      </form>
    </div>
  );
}

export default CreatPost;
