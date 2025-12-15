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

  const token = localStorage.getItem("token");

  const sidebarHandler = (text) => {
    switch (text) {
      case "Home":
        navigate("/");
        break;
      case "Search":
        navigate("/search");
        break;
      case "Explore":
        navigate("/explore");
        break;
      case "Messages":
        navigate("/messages");
        break;
      case "Notifications":
        navigate("/notifications");
        break;
      case "Create":
        navigate("/create");
        break;
      case "Profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

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
    try {
      await axios.post("http://localhost:5000/api/users/logout");
    } catch (error) {
      
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="h-screen w-64 border-r bg-white px-4 py-6 flex flex-col fixed">
      
    
      <div className="flex items-center gap-3 mb-10 px-2">
        <h1 className="text-xl font-bold tracking-wide">BaatCheet</h1>
      </div>

     
      <div className="flex flex-col gap-6 flex-1">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.text)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg
                       cursor-pointer hover:bg-gray-100 active:scale-[0.98]
                       transition-all duration-200"
          >
            <span className="text-gray-700">{item.icon}</span>
            <span className="font-semibold text-lg text-gray-800">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {token ? (
        <div
          onClick={logoutHandler}
          className="flex items-center gap-4 px-3 py-2 rounded-lg
                     cursor-pointer hover:bg-red-50 transition"
        >
          <FaSignOutAlt size={20} className="text-red-500" />
          <span className="font-medium text-red-600">Logout</span>
        </div>
      ) : (
        <div
          onClick={() => navigate("/login")}
          className="flex items-center gap-4 px-3 py-2 rounded-lg
                     cursor-pointer hover:bg-blue-50 transition"
        >
          <FaUserCircle size={20} className="text-blue-500" />
          <span className="font-medium text-blue-600">Login</span>
        </div>
      )}
    </div>
  );
};

export default LeftsideBar;
