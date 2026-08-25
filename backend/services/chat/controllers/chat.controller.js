import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversation = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { conversationId, title } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { title: title },
      { new: true },
    );

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images, artifacts } = req.body;
    const message = await Message.create({
      conversation: conversationId,
      role: role,
      content: content,
      images,
      artifacts,
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};
