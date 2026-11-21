import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import JobNavbar from "./JobNavbar";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaFileAlt,
  FaTrash,
  FaEye,
} from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
function Jobshow() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/jobs/my-jobs`, {
        withCredentials: true,
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`${API_URL}/api/v1/jobs/${id}`, {
        withCredentials: true,
      });
      toast.success("Job deleted successfully!");
      getMyJobs();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  useEffect(() => {
    getMyJobs();
  }, []);

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
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: "#1e3a8a" }}>
              <FaBriefcase className="me-2" /> My Jobs Dashboard
            </h1>
            <p className="text-muted mb-0">
              Manage your job postings effectively
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-light text-dark border px-3 py-2">
              <FaEye className="me-1" /> Total: {jobs.length}
            </span>
            <Link
              to="/job/create"
              className="btn d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none",
                color: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 8px 25px 0 rgba(16, 185, 129, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 14px 0 rgba(16, 185, 129, 0.39)";
              }}
            >
              <FaPlus /> Create New Job
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div className="col-12 col-md-6 col-lg-4" key={job._id}>
                <div
                  className="card shadow h-100 border-0 job-card"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    borderRadius: "1rem",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="position-relative">
                    {job.image ? (
                      <img
                        src={`${API_URL}${job.image}`}
                        alt={job.title}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          borderTopLeftRadius: "1rem",
                          borderTopRightRadius: "1rem",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-gradient position-relative"
                        style={{
                          height: "200px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderTopLeftRadius: "1rem",
                          borderTopRightRadius: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaBriefcase
                          className="text-white"
                          style={{ fontSize: "3rem", opacity: 0.8 }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <div className="mb-2 d-flex align-items-center gap-2 flex-wrap">
                      <h5 className="card-title mb-0 fw-bold">{job.title}</h5>
                      {job.company && (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "#eaffb9",
                            color: "#1d4034",
                            fontWeight: 500,
                            fontSize: "0.96em",
                          }}
                        >
                          {job.company}
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-light text-secondary border px-3 py-2 me-2 mb-2 d-flex align-items-center gap-1 shadow-sm">
                        <FaMapMarkerAlt className="fs-6" /> {job.location}
                      </span>
                      <span className="badge bg-light text-success border px-3 py-2 me-2 mb-2 d-flex align-items-center gap-1 shadow-sm">
                        <FaBriefcase className="fs-6" /> {job.type}
                      </span>
                      <span className="badge bg-light text-info border px-3 py-2 me-2 mb-2 d-flex align-items-center gap-1 shadow-sm">
                        <FaClock className="fs-6" /> {job.experience}
                      </span>
                    </div>
                    <p
                      className="card-text text-muted mb-3"
                      style={{ minHeight: 46 }}
                    >
                      {job.description.length > 60
                        ? job.description.substring(0, 60) + "..."
                        : job.description}
                    </p>
                    <div className="mt-auto pt-3 border-top">
                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <Link
                            to={`/job/Job-edit/${job._id}`}
                            className="btn btn-outline-primary btn-sm w-100 d-flex flex-column align-items-center gap-1 p-2"
                            style={{ transition: "all 0.3s ease" }}
                          >
                            <FaEdit className="fs-5" />
                            <small className="fw-semibold">Edit</small>
                          </Link>
                        </div>
                        <div className="col-4">
                          <Link
                            to={`/job/applications/${job._id}`}
                            className="btn btn-outline-success btn-sm w-100 d-flex flex-column align-items-center gap-1 p-2"
                            style={{ transition: "all 0.3s ease" }}
                          >
                            <FaFileAlt className="fs-5" />
                            <small className="fw-semibold">Applications</small>
                          </Link>
                        </div>
                        <div className="col-4">
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="btn btn-outline-danger btn-sm w-100 d-flex flex-column align-items-center gap-1 p-2"
                            style={{ transition: "all 0.3s ease" }}
                          >
                            <FaTrash className="fs-5" />
                            <small className="fw-semibold">Delete</small>
                          </button>
                        </div>
                      </div>
                      <div className="text-center text-muted small">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div
                className="text-center py-5"
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                <div className="mb-4">
                  <div
                    style={{
                      height: "120px",
                      width: "120px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      margin: "0 auto 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <FaBriefcase
                      style={{ fontSize: "3.5rem", color: "white" }}
                    />
                  </div>
                  <h3 className="fw-bold text-muted mb-3">
                    No Jobs Posted Yet
                  </h3>
                  <p className="lead text-muted mb-4">
                    Get started by creating your first job posting and attract
                    top talent to your company.
                  </p>
                </div>
                <Link
                  to="/job/create"
                  className="btn px-5 py-3 fw-bold fs-6"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    color: "white",
                    borderRadius: "50px",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                    fontSize: "1.1rem",
                  }}
                >
                  <FaPlus className="me-2" /> Create Your First Job
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Jobshow;
