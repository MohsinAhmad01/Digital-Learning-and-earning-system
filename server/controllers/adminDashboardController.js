import { User } from "../models/userModel.js";
import { Course } from "../models/CourseModel.js";
import { Video } from "../models/VideoModel.js";
import { Certificate } from "../models/CertificateModel.js";
import { Blog } from "../models/BlogModel.js";
import { Job } from "../models/JobModel.js";
import Application from "../models/JobApplication.js";
import Gig from "../models/gigModel.js";
import Order from "../models/orderModel.js";
import Reviewmodel from "../models/ReviewModel.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const getMonthlyData = async (Model, dateField = "createdAt") => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  return await Model.aggregate([
    { $match: { [dateField]: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          month: { $month: `$${dateField}` },
          year: { $year: `$${dateField}` },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalVideos,
      totalCertificates,
      totalBlogs,
      totalJobs,
      totalApplications,
      totalGigs,
      totalOrders,
      totalReviews,
      totalConversations,
      totalMessages,
      latestUsers,
      latestOrders,
      topCourses,
      topBlogs,
      topGigs,
      roleStats,
      orderStatusStats,
      revenueStats,
      monthlyUsers,
      monthlyOrders,
      monthlyCourses,
      monthlyJobs,
      monthlyRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Video.countDocuments(),
      Certificate.countDocuments(),
      Blog.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Gig.countDocuments(),
      Order.countDocuments(),
      Reviewmodel.countDocuments(),
      Conversation.countDocuments(),
      Message.countDocuments(),

      User.find().sort({ createdAt: -1 }).limit(6).select("name email role createdAt"),
      Order.find().sort({ createdAt: -1 }).limit(6).select("title price paidAmount status createdAt").populate("buyer", "name").populate("seller", "name"),
      Course.find().sort({ views: -1 }).limit(5).select("title views Catagory"),
      Blog.find().sort({ views: -1 }).limit(5).select("title views category"),
      Gig.find().sort({ sales: -1 }).limit(5).select("title sales category"),

      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$paidAmount" },
            pendingAmount: { $sum: "$remainingAmount" },
            totalOrderValue: { $sum: "$price" },
          },
        },
      ]),

      getMonthlyData(User, "createdAt"),
      getMonthlyData(Order, "createdAt"),
      getMonthlyData(Course, "_id"),
      getMonthlyData(Job, "createdAt"),

      Order.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            revenue: { $sum: "$paidAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalVideos,
        totalCertificates,
        totalBlogs,
        totalJobs,
        totalApplications,
        totalGigs,
        totalOrders,
        totalReviews,
        totalConversations,
        totalMessages,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        pendingAmount: revenueStats[0]?.pendingAmount || 0,
        totalOrderValue: revenueStats[0]?.totalOrderValue || 0,
      },
      latestUsers,
      latestOrders,
      topCourses,
      topBlogs,
      topGigs,
      roleStats,
      orderStatusStats,
      monthlyUsers,
      monthlyOrders,
      monthlyCourses,
      monthlyJobs,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};