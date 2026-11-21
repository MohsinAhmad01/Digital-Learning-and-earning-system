import Application from "../models/JobApplication.js";

export const createApplication = async (req, res, next) => {
  try {
    const { job, linkedin, fullName, email, phone, company, portfolio, website, coverLetter } = req.body;
    const resume = req.file ? `/uploads/${req.file.filename}` : '';
    const application = await Application.create({
      job, linkedin, fullName, email, phone, company, portfolio, website, coverLetter, resume
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// For admin: get all applications per job
export const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};