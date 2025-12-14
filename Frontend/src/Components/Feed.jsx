import React from "react";
import Posts from "./Posts";

function Feed() {
  return (
    <div className="flex-1 flex justify-center px-6 py-4">
      <div className="w-full max-w-xl">
        <Posts />
      </div>
    </div>
  );
}


export default Feed;
