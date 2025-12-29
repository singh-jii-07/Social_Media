import Signup from "./Components/Signup";
import Login from "./Components/Login";
import MainLayout from "./Components/MainLayout";
import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./Components/Profile";
import CreatPost from "./Components/CreatPost";
import Search from "./Components/Search";
import Notifications from "./Components/Notifications";
import Explore from "./Components/Explore";
import ProtectedRoute from "./Components/ProtectedRoute";
import Chatpage from "./Components/Chatpage";

function App() {
  const browserRouter = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <MainLayout />,
          children: [
            { index: true, element: <Home /> },
            { path: "profile", element: <Profile /> },
            { path: "create", element: <CreatPost /> },
            { path: "search", element: <Search /> },
            { path: "messages", element: <Chatpage /> }, 
            { path: "notifications", element: <Notifications /> },
            { path: "explore", element: <Explore /> },
          ],
        },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
  ]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
