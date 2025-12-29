import Conversation from "../Models/ConversationModels.js";
import Message from "../Models/MessageModels.js";
import { getReceiverSocketId, io } from "../Socket/Socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage } = req.body;

    if (!textMessage || textMessage.trim() === "") {
      return res.status(400).json({ success: false });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: textMessage,
      messageType: "text"   
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    // socket emit
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!conversation) {
      return res.json({ success: true, messages: [] });
    }

    return res.json({
      success: true,
      messages: conversation.messages
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
};
