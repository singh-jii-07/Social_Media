import React from "react";
import { Outlet } from "react-router-dom";
import LeftsideBar from "./LeftsideBar";

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <LeftsideBar />

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;
