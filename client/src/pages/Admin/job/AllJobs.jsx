import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  const getJobs = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/jobs/admin/jobs`,
        { withCredentials: true }
      );
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/jobs/${id}`, {
        withCredentials: true,
      });
      getJobs(); // Refresh after delete
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="container my-4">
        <h2 className="fw-bold mb-4 text-success">Manage All Jobs</h2>
        <div className="row g-4">
          {jobs.map((job) => (
            <div className="col-12 col-md-6 col-lg-4" key={job._id}>
              <div className="card shadow h-100 border-0">
                {job.image && (
                  <img
                    src={`${API_URL}${job.image}`}
                    alt="job"
                    className="card-img-top"
                    style={{
                      height: "170px",
                      objectFit: "cover",
                      borderTopLeftRadius: "0.6rem",
                      borderTopRightRadius: "0.6rem",
                    }}
                  />
                )}
                <div className="card-body d-flex flex-column">
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
                  <div className="mb-2">
                    <span className="badge bg-light text-secondary border me-1 mb-1">
                      <i className="bi bi-geo-alt me-1"></i>{job.location}
                    </span>
                    <span className="badge bg-light text-success border me-1 mb-1">
                      <i className="bi bi-briefcase me-1"></i>{job.type}
                    </span>
                    <span className="badge bg-light text-info border mb-1">
                      <i className="bi bi-hourglass me-1"></i>{job.experience}
                    </span>
                  </div>
                  <p className="card-text text-muted mb-3" style={{ minHeight: 46 }}>
                    {job.description.length > 60
                      ? job.description.substring(0, 60) + "..."
                      : job.description}
                  </p>
                  <div className="mt-auto d-flex flex-column flex-sm-row gap-2 w-100">
                    <Link
                      to={`/admin/edit-job/${job._id}`}
                      className="btn btn-outline-primary btn-sm flex-fill"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/applications/${job._id}`}
                      className="btn btn-outline-success btn-sm flex-fill"
                    >
                      Applications
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="btn btn-outline-danger btn-sm flex-fill"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="col-12">
              <div className="alert alert-info text-center">No jobs found.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllJobs;