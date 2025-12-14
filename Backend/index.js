import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoutes from './App/Routes/UserRoutes.js'
import Postrouter from './App/Routes/PostRoutes.js'
import messageRoutes from './App/Routes/MessageRoutes.js'


const app = express();
dotenv.config();

app.use(express.json());
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use("/api/users", userRoutes);
app.use("/api/post", Postrouter);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_DB; 

if (!MONGO_URI) {
  console.error("Mongo URI not found. Check your .env file (MONGO_DB)");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongoose is connected");

    app.get('/', (req, res) => {
      res.send("Welcome to Social_Media API");
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
