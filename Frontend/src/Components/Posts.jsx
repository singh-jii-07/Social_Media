import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import { authHeader } from "../utils/authHeader";

const API = "http://localhost:5000/api/post";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/getpost`, {
        headers: authHeader(),
      });

      console.log("POSTS 👉", res.data.posts);
      setPosts(res.data.posts);
    } catch (error) {
      console.log("ERROR 👉", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading posts...</p>;
  }

  return (
    <div className="w-full">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            loggedInUserId={user?._id}
            onPostDelete={(id) =>
              setPosts((prev) => prev.filter((p) => p._id !== id))
            }
          />
        ))
      ) : (
        <p className="text-center mt-10">No posts found</p>
      )}
    </div>
  );
}

export default Posts;
