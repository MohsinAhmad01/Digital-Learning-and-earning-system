import Order from "../models/OrderModel.js";
import Gig from "../models/gigModel.js";
import { User } from "../models/userModel.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const getOrCreateConversation = async ({ buyer, seller, gig }) => {
  let conversation = await Conversation.findOne({
    participants: {
      $all: [buyer, seller],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [buyer, seller],
      gig,
    });
  }

  return conversation;
};

const sendSystemMessage = async ({ req, conversationId, senderId, text }) => {
  let message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text,
    attachments: [],
    readBy: [senderId],
  });

  message = await Message.findById(message._id).populate(
    "sender",
    "name avatar role",
  );

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text,
    lastMessageAt: new Date(),
  });

  const io = req.app.get("io");

  if (io) {
    io.to(conversationId.toString()).emit("newMessage", message);
    io.to(conversationId.toString()).emit("conversationUpdated", {
      conversationId,
      lastMessage: text,
      lastMessageAt: new Date(),
    });
  }

  return message;
};

/* ===============================
   CREATE ORDER WITHOUT PAYMENT
================================ */

export const createOrder = async (req, res) => {
  try {
    const { gigId, packageType = "basic", requirements } = req.body;

    if (!gigId || !requirements) {
      return res.status(400).json({
        success: false,
        message: "Gig ID and requirements are required.",
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    if (gig.owner.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot order your own gig.",
      });
    }

    const selectedPackage = gig.packages?.[packageType];

    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        message: "Invalid package selected.",
      });
    }

    const price = Number(selectedPackage.price);
    const deliveryTime = Number(selectedPackage.deliveryTime);

    const deadline = new Date(Date.now() + deliveryTime * 24 * 60 * 60 * 1000);

    const order = await Order.create({
      buyer: req.user._id,
      seller: gig.owner,
      gig: gig._id,

      title: gig.title,
      price,
      packageType,

      packageSnapshot: {
        packageName: selectedPackage.packageName,
        title: selectedPackage.title,
        description: selectedPackage.description,
        price: selectedPackage.price,
        deliveryTime: selectedPackage.deliveryTime,
        revisionNumber: selectedPackage.revisionNumber,
        features: selectedPackage.features || [],
      },

      requirements,
      paidAmount: 0,
      remainingAmount: price,
      progressPercent: 0,
      status: "in_progress",
      deadline,
    });

    const conversation = await getOrCreateConversation({
      buyer: req.user._id,
      seller: gig.owner,
      gig: gig._id,
    });

    await sendSystemMessage({
      req,
      conversationId: conversation._id,
      senderId: req.user._id,
      text: `Order started for "${gig.title}". Requirements: ${requirements}`,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

/* ===============================
   SELLER SENDS MILESTONE REQUEST
================================ */

export const requestMilestonePayment = async (req, res) => {
  try {
    const { orderId, title, description, percent } = req.body;

    if (!orderId || !title || !percent) {
      return res.status(400).json({
        success: false,
        message: "Order ID, title, percent, and amount are required.",
      });
    }

    const order = await Order.findById(orderId).populate("gig", "title");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only seller can send milestone request.",
      });
    }

    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot request milestone for this order.",
      });
    }
    const requestedPercent = Number(percent);

    const requestedAmount = (order.price * requestedPercent) / 100;
    const totalRequestedPercent = order.milestones.reduce(
      (sum, m) => sum + Number(m.percent || 0),
      0,
    );

    if (totalRequestedPercent + requestedPercent > 100) {
      return res.status(400).json({
        success: false,
        message: "Total milestone completion percentage cannot exceed 100%.",
      });
    }
    if (requestedAmount <= 0 || requestedPercent <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount and percent must be greater than 0.",
      });
    }

    const totalRequestedAndPaid = order.milestones.reduce(
      (sum, milestone) => sum + Number(milestone.amount || 0),
      0,
    );

    if (totalRequestedAndPaid + requestedAmount > order.price) {
      return res.status(400).json({
        success: false,
        message: "Milestone amount cannot exceed total order price.",
      });
    }

    order.milestones.push({
      title,
      description,
      percent: requestedPercent,
      amount: requestedAmount,
      status: "requested",
      requestedAt: new Date(),
    });

    await order.save();

    const milestone = order.milestones[order.milestones.length - 1];

    const conversation = await getOrCreateConversation({
      buyer: order.buyer,
      seller: order.seller,
      gig: order.gig,
    });

    const autoMessage = `Milestone Payment Request: ${requestedPercent}% work completed for "${order.title}". Amount requested: $${requestedAmount}. ${description || ""}`;

    const message = await sendSystemMessage({
      req,
      conversationId: conversation._id,
      senderId: req.user._id,
      text: autoMessage,
    });

    milestone.messageId = message._id;
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Milestone payment request sent successfully.",
      order,
      milestone,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.log("MILESTONE REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send milestone request.",
      error: error.message,
    });
  }
};

/* ===============================
   BUYER MARKS MILESTONE AS PAID
================================ */

export const confirmMilestonePaid = async (req, res) => {
  try {
    const { orderId, milestoneId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only buyer can mark milestone as paid.",
      });
    }

    const milestone = order.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found.",
      });
    }

    if (milestone.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "This milestone is already marked as paid.",
      });
    }

    milestone.status = "paid";
    milestone.paidAt = new Date();

    order.paidAmount += Number(milestone.amount);
    order.remainingAmount = Math.max(order.price - order.paidAmount, 0);

    const paidPercent = order.milestones
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + Number(item.percent || 0), 0);

    order.progressPercent = Math.min(paidPercent, 100);

    await order.save();

    await User.findByIdAndUpdate(order.seller, {
      $inc: {
        walletBalance: Number(milestone.amount),
        totalEarned: Number(milestone.amount),
      },
    });

    const conversation = await getOrCreateConversation({
      buyer: order.buyer,
      seller: order.seller,
      gig: order.gig,
    });

    await sendSystemMessage({
      req,
      conversationId: conversation._id,
      senderId: req.user._id,
      text: `Payment confirmed for milestone "${milestone.title}". Amount paid: $${milestone.amount}.`,
    });

    return res.status(200).json({
      success: true,
      message: "Milestone marked as paid and seller wallet updated.",
      order,
    });
  } catch (error) {
    console.log("CONFIRM MILESTONE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm milestone payment.",
      error: error.message,
    });
  }
};

/* ===============================
   GET ORDERS
================================ */

export const getOrders = async (req, res) => {
  try {
    const sellerOrders = await Order.find({ seller: req.user._id })
      .populate("gig", "title cover category packages")
      .populate("buyer", "name avatar email role")
      .populate("seller", "name avatar email role")
      .sort({ createdAt: -1 });

    const buyerOrders = await Order.find({ buyer: req.user._id })
      .populate("gig", "title cover category packages")
      .populate("buyer", "name avatar email role")
      .populate("seller", "name avatar email role")
      .sort({ createdAt: -1 });

    const formattedSellerOrders = sellerOrders.map((order) => ({
      ...order.toObject(),
      currentUserRoleInOrder: "seller",
      otherUser: order.buyer,
    }));

    const formattedBuyerOrders = buyerOrders.map((order) => ({
      ...order.toObject(),
      currentUserRoleInOrder: "buyer",
      otherUser: order.seller,
    }));

    const orders = [...formattedSellerOrders, ...formattedBuyerOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};
/* ===============================
   SELLER DELIVERS ORDER
================================ */

export const deliverOrder = async (req, res) => {
  try {
    const { orderId, deliveryFiles, deliveryMessage } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    order.deliveryFiles = deliveryFiles || [];
    order.deliveryMessage = deliveryMessage || "";
    order.deliveredAt = new Date();
    order.status = "delivered";

    await order.save();

    const conversation = await getOrCreateConversation({
      buyer: order.buyer,
      seller: order.seller,
      gig: order.gig,
    });

    await sendSystemMessage({
      req,
      conversationId: conversation._id,
      senderId: req.user._id,
      text: `Order delivered: "${order.title}". Please review the delivery and approve if everything is complete.`,
    });

    return res.status(200).json({
      success: true,
      message: "Order delivered successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to deliver order.",
      error: error.message,
    });
  }
};

/* ===============================
   BUYER APPROVES ORDER
================================ */

export const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order already completed.",
      });
    }

    order.status = "completed";
    order.completedAt = new Date();
    order.progressPercent = 100;
    order.isReviewed = false;

    await order.save();

    // Update Seller Statistics
    await User.findByIdAndUpdate(order.seller, {
      $inc: {
        totalOrders: 1,
        walletBalance: order.paidAmount,
        totalSales: order.paidAmount,
      },
    });

    // Update Gig Statistics
    await Gig.findByIdAndUpdate(order.gig, {
      $inc: {
        sales: 1,
      },
    });

    const conversation = await getOrCreateConversation({
      buyer: order.buyer,
      seller: order.seller,
      gig: order.gig,
    });

    await sendSystemMessage({
      req,
      conversationId: conversation._id,
      senderId: req.user._id,
      text: `Order approved and completed: "${order.title}". Thank you for using DevTech.`,
    });

    return res.status(200).json({
      success: true,
      message: "Order completed successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve order.",
      error: error.message,
    });
  }
};
export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("gig", "title cover category packages")
      .populate("buyer", "name avatar email")
      .populate("seller", "name avatar email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.seller._id.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this order.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
};
