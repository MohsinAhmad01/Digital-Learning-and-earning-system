import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import JobNavbar from "./JobNavbar";
import { toast } from "react-toastify";
import { FaLinkedin, FaDownload, FaEnvelope, FaPhoneAlt, FaFileAlt } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobRes = await axios.get(
          `${API_URL}/api/v1/jobs/${jobId}`,
          { withCredentials: true }
        );
        setJob(jobRes.data.job);

        // Fetch applications for this job
        const appRes = await axios.get(
          `${API_URL}/api/v1/applications/job/${jobId}`,
          { withCredentials: true }
        );
        setApplications(appRes.data.applications || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [jobId]);

  const handleDownloadResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(`${API_URL}${resumeUrl}`, "_blank");
    }
  };

  if (loading) {
    return (
      <>
        <JobNavbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <JobNavbar />
      <div className="container my-5">
        <button
          onClick={() => navigate("/job/show-all")}
          className="btn btn-secondary mb-3"
        >
          ← Back to Jobs
        </button>

        {job && (
          <div className="mb-4 border-bottom pb-3">
            <h3 className="fw-bold mb-1">
              Applications for <span className="text-success">{job.title}</span>
            </h3>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              {job.company && (
                <span className="badge bg-light text-dark border">
                  <strong>Company:</strong> {job.company}
                </span>
              )}
              {job.location && (
                <span className="badge bg-light text-dark border">
                  <strong>Location:</strong> {job.location}
                </span>
              )}
              {job.type && (
                <span className="badge bg-light text-dark border">
                  <strong>Type:</strong> {job.type}
                </span>
              )}
              <span className="badge bg-success text-white fs-6 ms-auto">
                Total Applications: {applications.length}
              </span>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="alert alert-warning">No applications received yet.</div>
        ) : (
          <div className="row">
            {applications.map((app, idx) => (
              <div key={app._id} className="col-md-6 col-lg-4">
                <div className="card shadow mb-4 border-0">
                  <div className="card-header bg-success text-white">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <div><FaFileAlt className="me-1" /> Application #{idx + 1}</div>
                      <span className="badge bg-light text-dark ms-auto">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="card-body pt-3">
                    <p className="mb-1"><strong>Name:</strong> {app.fullName}</p>
                    <p className="mb-1">
                      <strong>Email:</strong> <a href={`mailto:${app.email}`}><FaEnvelope className="me-1" /> {app.email}</a>
                    </p>
                    {app.phone && (
                      <p className="mb-1">
                        <strong>Phone:</strong> <a href={`tel:${app.phone}`}><FaPhoneAlt className="me-1" /> {app.phone}</a>
                      </p>
                    )}
                    {app.linkedin && (
                      <p className="mb-1">
                        <strong>LinkedIn:</strong> <a href={app.linkedin} target="_blank" rel="noreferrer"><FaLinkedin className="me-1 text-primary" />{app.linkedin}</a>
                      </p>
                    )}
                    {app.company && (
                      <p className="mb-1"><strong>Company:</strong> {app.company}</p>
                    )}
                    {app.portfolio && (
                      <p className="mb-1"><strong>Portfolio:</strong> <a href={app.portfolio} target="_blank" rel="noreferrer">{app.portfolio}</a></p>
                    )}
                    {app.website && (
                      <p className="mb-1"><strong>Other Website:</strong> <a href={app.website} target="_blank" rel="noreferrer">{app.website}</a></p>
                    )}
                    <p className="mb-1"><strong>Cover Letter:</strong>
                      <br />
                      <span className="text-secondary">{app.coverLetter || <span className="fst-italic text-muted">Not provided</span>}</span>
                    </p>
                    <p className="mb-1"><strong>Resume / CV:</strong>
                      <br />
                      {app.resume ? (
                        <button
                          onClick={() => handleDownloadResume(app.resume)}
                          className="btn btn-outline-success btn-sm mt-1"
                        >
                          <FaDownload className="me-1" /> Download CV
                        </button>
                      ) : (
                        <span className="badge bg-danger">No file submitted</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default JobApplications;
