import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightsideBar from "./RightsideBar";
import CreatPost from "./CreatPost";

function Home() {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightsideBar/>
    </div>
  );
}

export default Home;
