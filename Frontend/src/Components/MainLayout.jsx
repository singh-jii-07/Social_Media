import React from "react";
import { Outlet } from "react-router-dom";
import LeftsideBar from "./LeftsideBar";

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar (fixed, width = w-64) */}
      <LeftsideBar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
