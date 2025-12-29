import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  query: {
    userId: JSON.parse(localStorage.getItem("user"))?._id,
  },
});

export default socket;
