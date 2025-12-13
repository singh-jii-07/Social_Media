import Signup from "./Components/Signup";
import Login from "./Components/Login";
import MainLayout from './Components/MainLayout'
import Home from './Components/Home'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);
  return <RouterProvider router={browserRouter} />;
}

export default App;
