import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import Gig from "../models/gigModel.js";

const getUploadedAttachments = (req) => {
  if (!req.files || req.files.length === 0) {
    return [];
  }

  return req.files.map((file) => ({
    url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    fileName: file.originalname,
    fileType: file.mimetype,
  }));
};

/* ===============================
   START OR GET CONVERSATION
================================ */

export const startConversation = async (req, res) => {
  try {
    const { receiverId, gigId, orderId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID.",
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot start chat with yourself.",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        gig: gigId || null,
        order: orderId || null,
      });
    } else {
      if (gigId && !conversation.gig) {
        conversation.gig = gigId;
      }

      if (orderId && !conversation.order) {
        conversation.order = orderId;
      }

      await conversation.save();
    }

    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "name avatar role")
      .populate("gig", "title cover packages")
      .populate("order", "title price status");

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to start conversation.",
      error: error.message,
    });
  }
};

/* ===============================
   GET MY CONVERSATIONS
================================ */

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name avatar role")
      .populate("gig", "title cover packages")
      .populate("order", "title price status")
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations.",
      error: error.message,
    });
  }
};

/* ===============================
   GET MESSAGES
================================ */

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (userId) => userId.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this conversation.",
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name avatar role")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversation: conversationId,
        readBy: { $ne: req.user._id },
      },
      {
        $addToSet: {
          readBy: req.user._id,
        },
      },
    );
    const io = req.app.get("io");

    if (io) {
      io.to(`user:${req.user._id}`).emit("unreadMessageCountUpdated");
    }

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
      error: error.message,
    });
  }
};

/* ===============================
   SEND MESSAGE
================================ */

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (userId) => userId.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to send message here.",
      });
    }

    const attachments = getUploadedAttachments(req);

    if (!text?.trim() && attachments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message text or attachment is required.",
      });
    }

    let message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text || "",
      attachments,
      readBy: [req.user._id],
    });

    message = await Message.findById(message._id).populate(
      "sender",
      "name avatar role",
    );

    conversation.lastMessage =
      text?.trim() || (attachments.length > 0 ? "Sent an attachment" : "");

    conversation.lastMessageAt = new Date();

    await conversation.save();

    const io = req.app.get("io");

    if (io) {
      io.to(conversationId).emit("newMessage", message);

      io.to(conversationId).emit("conversationUpdated", {
        conversationId,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
      });

      conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== req.user._id.toString()) {
          io.to(`user:${participantId}`).emit("unreadMessageCountUpdated");
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
      error: error.message,
    });
  }
};
export const toggleStarConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to star this conversation.",
      });
    }

    const alreadyStarred = conversation.starredBy?.some(
      (userId) => userId.toString() === req.user._id.toString(),
    );

    if (alreadyStarred) {
      conversation.starredBy = conversation.starredBy.filter(
        (userId) => userId.toString() !== req.user._id.toString(),
      );
    } else {
      const starredCount = await Conversation.countDocuments({
        participants: req.user._id,
        starredBy: req.user._id,
      });

      if (starredCount >= 3) {
        return res.status(400).json({
          success: false,
          message: "You can star maximum 3 conversations only.",
        });
      }

      conversation.starredBy.push(req.user._id);
    }

    await conversation.save();

    const updatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name avatar role")
      .populate("gig", "title cover packages")
      .populate("order", "title price status");

    return res.status(200).json({
      success: true,
      message: alreadyStarred
        ? "Conversation removed from starred."
        : "Conversation added to starred.",
      isStarred: !alreadyStarred,
      conversation: updatedConversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update starred conversation.",
      error: error.message,
    });
  }
};
export const getUnreadMessageCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    }).select("_id");

    const conversationIds = conversations.map(
      (conversation) => conversation._id,
    );

    const totalUnread = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    });

    return res.status(200).json({
      success: true,
      totalUnread,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread message count.",
      error: error.message,
    });
  }
};
