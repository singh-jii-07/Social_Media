import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex flex-col">

      {/* Logo Top Center */}
      <div className="w-full flex items-center justify-center py-6">
        <h1 className="text-3xl font-extrabold text-indigo-600 tracking-wide">
          TalkHub
        </h1>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row w-full flex-1 items-center justify-center">

        {/* LEFT - Promotion */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start px-10 mt-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Join The New Era of Social Interaction 🚀
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            ✨ Connect with people who inspire you.
          </p>
          <p className="text-gray-600 text-lg">
            📸 Share your thoughts, photos, and moments.
          </p>
          <p className="text-gray-600 text-lg">
            💬 Chat, express, and build real connections.
          </p>
          <p className="text-gray-600 text-lg">
            🌍 Discover stories and ideas from around the world.
          </p>
        </div>

        {/* RIGHT - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 mt-6">
          <SignIn />
        </div>

      </div>
    </div>
  );
};

export default Login;
