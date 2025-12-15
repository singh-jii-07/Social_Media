import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { authHeader } from "../utils/authHeader";

const API = "http://localhost:5000/api/post";

function Post({ post, loggedInUserId, onPostDelete }) {

  if (!post) {
    return (
      <div className="my-6 w-full max-w-md mx-auto bg-white border rounded-md p-4">
        Loading post...
      </div>
    );
  }

  /* ===== STATES ===== */
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  /* ===== SYNC POST DATA ===== */
  useEffect(() => {
    setLiked(post.likes?.includes(loggedInUserId));
    setLikesCount(post.likes?.length || 0);
  }, [post, loggedInUserId]);

  /* ===== LIKE / DISLIKE ===== */
  const likeHandler = async () => {
    try {
      await axios.get(
        `${API}/${liked ? "dislike" : "like"}/${post._id}`,
        { headers: authHeader() }
      );

      setLiked(!liked);
      setLikesCount((p) => (liked ? p - 1 : p + 1));
    } catch {
      toast.error("Like failed");
    }
  };

  /* ===== ADD COMMENT ===== */
  const addCommentHandler = async () => {
    if (!comment.trim()) return;

    try {
      const res = await axios.post(
        `${API}/comment/${post._id}`,
        { text: comment },
        { headers: authHeader() }
      );

      if (showComments) {
        setComments((prev) => [res.data.comment, ...prev]);
      }

      setComment("");
    } catch {
      toast.error("Comment failed");
    }
  };

  /* ===== GET COMMENTS ===== */
  const getAllComments = async () => {
    try {
      const res = await axios.post(
        `${API}/comment/all/${post._id}`,
        {},
        { headers: authHeader() }
      );
      setComments(res.data.comments);
      setShowComments(true);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  /* ===== DELETE POST ===== */
  const deletePostHandler = async () => {
    try {
      await axios.delete(`${API}/delete/${post._id}`, {
        headers: authHeader(),
      });
      toast.success("Post deleted");
      onPostDelete(post._id);
    } catch {
      toast.error("Not authorized");
    }
  };

  /* ===== BOOKMARK ===== */
  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${API}/bookmark/${post._id}`,
        { headers: authHeader() }
      );
      setSaved(res.data.type === "saved");
      toast.success(res.data.message);
    } catch {
      toast.error("Bookmark failed");
    }
  };

  return (
    <div className="my-6 w-full max-w-md mx-auto bg-white border rounded-md">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 relative">
        <div className="flex items-center gap-2">
          <FaUserCircle size={32} className="text-gray-500" />
          <span className="font-semibold text-sm">
            {post.author?.username || "Unknown"}
          </span>
        </div>

        <button onClick={() => setOpenMenu(!openMenu)}>
          <FaEllipsisH />
        </button>

        {openMenu && (
          <div className="absolute right-4 top-12 w-40 bg-white border rounded shadow">
            <button
              onClick={bookmarkHandler}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              {saved ? "Remove Bookmark" : "Add to Favourite"}
            </button>

            {post.author?._id?.toString() === loggedInUserId && (
              <button
                onClick={deletePostHandler}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* IMAGE */}
      <img
        src={post.image}
        alt="post"
        className="w-full h-[420px] object-cover"
      />

      {/* ACTIONS */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={likeHandler}>
            {liked ? (
              <FaHeart size={22} className="text-red-500" />
            ) : (
              <FaRegHeart size={22} />
            )}
          </button>

          <button onClick={getAllComments}>
            <FaRegComment size={22} />
          </button>

          <FaShare size={20} />
        </div>

        <button onClick={bookmarkHandler}>
          {saved ? <FaBookmark size={22} /> : <FaRegBookmark size={22} />}
        </button>
      </div>

      {/* LIKES */}
      <p className="font-medium text-sm ml-4">
        {likesCount} likes
      </p>

      {/* CAPTION */}
      <div className="px-4 py-1">
        <p className="text-sm">
          <span className="font-semibold">
            {post.author?.username}
          </span>{" "}
          {post.caption}
        </p>
      </div>

      {/* COMMENTS */}
      <button
        onClick={getAllComments}
        className="text-sm text-gray-500 ml-4 mt-1"
      >
        View comments
      </button>

      {showComments && (
        <div className="px-4 mt-2 space-y-1">
          {comments.map((c) => (
            <p key={c._id} className="text-sm">
              <span className="font-semibold">
                {c.author?.username}
              </span>{" "}
              {c.text}
            </p>
          ))}
        </div>
      )}

      {/* ADD COMMENT */}
      <div className="flex items-center gap-2 px-4 py-3 border-t mt-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm outline-none"
        />
        <button
          onClick={addCommentHandler}
          disabled={!comment.trim()}
          className="text-blue-500 font-semibold disabled:text-blue-300"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default Post;
