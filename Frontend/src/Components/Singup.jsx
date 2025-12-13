import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("User registered successfully 🎉");
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="w-[320px] bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Signup</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Create your account
        </p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={changeHandler}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={changeHandler}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={changeHandler}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded
                     hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
