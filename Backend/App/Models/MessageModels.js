import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    messageType: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
