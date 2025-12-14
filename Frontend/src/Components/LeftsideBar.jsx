import React from "react";
import {
  FaHome,
  FaSearch,
  FaCompass,
  FaHeart,
  FaPlusSquare,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LeftsideBar = () => {
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: <FaHome size={20} />, text: "Home" },
    { icon: <FaSearch size={20} />, text: "Search" },
    { icon: <FaCompass size={20} />, text: "Explore" },
    { icon: <MdMessage size={20} />, text: "Messages" },
    { icon: <FaHeart size={20} />, text: "Notifications" },
    { icon: <FaPlusSquare size={20} />, text: "Create" },
    { icon: <FaUserCircle size={20} />, text: "Profile" },
  ];

  const logoutHandler = async () => {
    console.log("Logout");
    
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="h-screen w-64 border-r bg-white px-4 py-6 flex flex-col">
      
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <h1 className="text-xl font-bold tracking-wide">BaatCheet</h1>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-8 flex-1">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-2 rounded-lg
                       cursor-pointer hover:bg-gray-100 active:scale-[0.98]
                       transition-all duration-200"
          >
            <span className="text-gray-700 ">{item.icon}</span>
            <span className=" font-bold text-2xl text-gray-800">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div
        onClick={logoutHandler}
        className="flex items-center gap-5 px-3 py-2 rounded-lg
                   cursor-pointer hover:bg-red-50 transition"
      >
        <FaSignOutAlt size={20} className="text-red-500" />
        <span className="text-base font-medium text-red-600">
          Logout
        </span>
      </div>
    </div>
  );
};

export default LeftsideBar;
