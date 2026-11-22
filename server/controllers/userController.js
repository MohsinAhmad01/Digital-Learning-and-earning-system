import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

import Gig from "../models/gigModel.js";
import Order from "../models/OrderModel.js";
import Reviewmodel from "../models/ReviewModel.js";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/* ===============================
   REGISTER
================================ */

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, phone, password, verificationMethod, role } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !verificationMethod ||
      !role
    ) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    function validatePhoneNumber(phone) {
      const phoneRegex = /^\+923\d{9}$/;
      return phoneRegex.test(phone);
    }

    if (!validatePhoneNumber(phone)) {
      return next(new ErrorHandler("Invalid phone number.", 400));
    }

    const existingUser = await User.findOne({
      $or: [
        { email, accountVerified: true },
        { phone, accountVerified: true },
      ],
    });

    if (existingUser) {
      return next(new ErrorHandler("Phone or Email is already used.", 400));
    }

    const registerationAttemptsByUser = await User.find({
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    });

    if (registerationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
          400,
        ),
      );
    }

    let avatar = {
      public_id: "",
      url: "",
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "digital-services/users",
        width: 400,
        height: 400,
        crop: "fill",
      });

      avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      fs.unlinkSync(req.file.path);
    }

    const userData = {
      name,
      email,
      phone,
      password,
      role,
      avatar,
    };

    const user = await User.create(userData);

    const verificationCode = await user.generateVerificationCode();

    await user.save();

    sendVerificationCode(
      verificationMethod,
      verificationCode,
      name,
      email,
      phone,
      res,
    );
  } catch (error) {
    next(error);
  }
});

/* ===============================
   SEND VERIFICATION CODE
================================ */

async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res,
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);

      sendEmail({
        email,
        subject: "Your Verification Code",
        message,
      });

      return res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${name}`,
      });
    }

    if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode
        .toString()
        .split("")
        .join(" ");

      await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Invalid verification method.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}

/* ===============================
   EMAIL TEMPLATE
================================ */

function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

/* ===============================
   UPDATE SETTING
================================ */

export const updateSetting = catchAsyncError(async (req, res, next) => {
  const { name, phone, bio, country, skills, languages } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (name) {
    user.name = name;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  if (country !== undefined) {
    user.country = country;
  }

  const parseArrayField = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  };

  if (skills !== undefined) {
    user.skills = parseArrayField(skills);
  }

  if (languages !== undefined) {
    user.languages = parseArrayField(languages);
  }

  if (phone) {
    const phoneRegex = /^\+923\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return next(new ErrorHandler("Invalid phone number.", 400));
    }

    const existingPhoneUser = await User.findOne({
      phone,
      _id: { $ne: user._id },
      accountVerified: true,
    });

    if (existingPhoneUser) {
      return next(new ErrorHandler("Phone number is already used.", 400));
    }

    user.phone = phone;
  }

  if (req.file) {
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "digital-services/users",
      width: 400,
      height: 400,
      crop: "fill",
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    fs.unlinkSync(req.file.path);
  }

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    message: "Profile settings updated successfully.",
    user,
  });
});

/* ===============================
   VERIFY OTP
================================ */

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+923\d{9}$/;
    return phoneRegex.test(phone);
  }

  if (!validatePhoneNumber(phone)) {
    return next(new ErrorHandler("Invalid phone number.", 400));
  }

  try {
    const userAllEntries = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false },
      ],
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      await User.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { phone, accountVerified: false },
          { email, accountVerified: false },
        ],
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire,
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account Verified.", res);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

/* ===============================
   LOGIN
================================ */

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }

  const user = await User.findOne({
    email,
    accountVerified: true,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  sendToken(user, 200, "User logged in successfully.", res);
});

/* ===============================
   LOGOUT
================================ */

export const logout = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

/* ===============================
   GET LOGGED-IN USER
================================ */

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    user,
  });
});

/* ===============================
   FORGOT PASSWORD
================================ */

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: "MERN AUTHENTICATION APP RESET PASSWORD",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        error.message ? error.message : "Cannot send reset password token.",
        500,
      ),
    );
  }
});

/* ===============================
   RESET PASSWORD
================================ */

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400,
      ),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400),
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Reset Password Successfully.", res);
});

/* ===============================
   PUBLIC FREELANCER PROFILE
================================ */

export const getPublicFreelancerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid freelancer ID.",
      });
    }

    const freelancer = await User.findById(id).select(
      "name avatar role bio skills country languages rating totalSales totalOrders createdAt",
    );

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found.",
      });
    }

    const gigs = await Gig.find({
      owner: freelancer._id,
      status: "published",
      isActive: true,
    }).sort({ createdAt: -1 });

    const gigIds = gigs.map((gig) => gig._id);

    let reviews = [];

    if (gigIds.length > 0) {
      reviews = await Reviewmodel.find({
        gigId: { $in: gigIds },
      })
        .populate("reviewer", "name avatar email")
        .populate("gigId", "title category cover packages")
        .sort({ createdAt: -1 });
    }

    const completedOrders = await Order.countDocuments({
      seller: freelancer._id,
      status: "completed",
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce(
                (sum, review) => sum + Number(review.rating || 0),
                0,
              ) / totalReviews
            ).toFixed(1),
          );

    return res.status(200).json({
      success: true,
      freelancer,
      gigs,
      reviews,
      stats: {
        averageRating,
        totalReviews,
        completedOrders,
      },
    });
  } catch (error) {
    console.log("PUBLIC FREELANCER PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer profile.",
      error: error.message,
    });
  }
};

export const getTopFreelancers = async (req, res) => {
  try {
    const freelancers = await User.find({
      role: "freelancer",
    }).select("name avatar bio walletBalance skills rating country createdAt");

    const freelancerStats = await Promise.all(
      freelancers.map(async (freelancer) => {
        const completedOrders = await Order.countDocuments({
          seller: freelancer._id,
          status: "completed",
        });

        const earningsResult = await Order.aggregate([
          {
            $match: {
              seller: freelancer._id,
              status: "completed",
            },
          },
          {
            $group: {
              _id: null,
              totalEarnings: {
                $sum: "$paidAmount",
              },
            },
          },
        ]);

        const totalEarnings =
          earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

        let sellerLevel = "New Seller";

        if (completedOrders >= 100 && freelancer.rating >= 4.8) {
          sellerLevel = "Top Rated Seller";
        } else if (completedOrders >= 50) {
          sellerLevel = "Level 2 Seller";
        } else if (completedOrders >= 10) {
          sellerLevel = "Level 1 Seller";
        }

        const score =
          (freelancer.rating || 0) * 50 +
          completedOrders * 5 +
          totalEarnings / 100;

        return {
          ...freelancer.toObject(),
          completedOrders,
          totalEarnings,
          sellerLevel,
          score,
        };
      }),
    );

    freelancerStats.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      freelancers: freelancerStats.slice(0, 8),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancers",
      error: error.message,
    });
  }
};
