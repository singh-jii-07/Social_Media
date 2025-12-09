import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      maxlength: 800,
      default: "",
    },

    image: {
      type: String, 
      default: "",
      require:true,
    },

    video: {
      type: String, 
      default: "",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      }
    ],

    comments: [
      {

          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
      }
        
    ],

    tags: [
      {
        type: String,
      }
    ],

    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },

    shares: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
