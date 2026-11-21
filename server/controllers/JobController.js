import { Job } from "../models/JobModel.js";
import mongoose from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

export const createJob = catchAsyncError(async (req, res, next) => {
  const {
    title,
    company,
    location,
    type,
    experience,
    description,
    requirements,
  } = req.body;

  if (!title || !experience || !description || !type) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  let imagePath = "";

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  const job = await Job.create({
    title,
    company,
    location,
    type,
    experience,
    description,
    image: imagePath,
    requirements: Array.isArray(requirements)
      ? requirements
      : typeof requirements === "string"
      ? requirements.split(",").map((item) => item.trim())
      : [],
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job created successfully.",
    job,
  });
});

export const getAllJobsForAdmin = catchAsyncError(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    jobs,
  });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

  if (!jobs) {
    return next(new ErrorHandler("No jobs found", 404));
  }

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});

export const getAllJobs = catchAsyncError(async (req, res) => {
  const { location, type, company, keyword } = req.query;

  const query = {};
  if (location) query.location = { $regex: location, $options: "i" };
  if (type) query.type = { $regex: type, $options: "i" };
  if (company) query.company = { $regex: company, $options: "i" };
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});

export const getJobDetail = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  res.status(200).json({
    success: true,
    job,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // Check if user is the creator
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to update this job", 403));
  }

  // Text fields update safely
  if (req.body.title) job.title = req.body.title;
  if (req.body.description) job.description = req.body.description;
  if (req.body.company) job.company = req.body.company;
  if (req.body.location) job.location = req.body.location;
  if (req.body.experience) job.experience = req.body.experience;

  if (req.body.type) {
    job.type = req.body.type;
  }

  if (req.body.requirements) {
    job.requirements = Array.isArray(req.body.requirements)
      ? req.body.requirements
      : req.body.requirements.split(",").map((item) => item.trim());
  }

  // Image update
  if (req.file) {
    job.image = `/uploads/${req.file.filename}`;
  }

  await job.save();

  res.status(200).json({
    success: true,
    message: "Job updated successfully.",
    job,
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // Check if user is the creator
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to delete this job", 403));
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully.",
  });
});