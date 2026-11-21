import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/AdminNavbar";
import { useParams, Link } from "react-router-dom";
import { FaLinkedin, FaDownload, FaEnvelope, FaPhoneAlt, FaFileAlt } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
const AdminJobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Fetch applications
      const appRes = await axios.get(
        `${API_URL}/api/v1/applications/job/${jobId}`,
        { withCredentials: true }
      );
      setApplications(appRes.data.applications);

      // Fetch job info
      const jobRes = await axios.get(
        `${API_URL}/api/v1/jobs/${jobId}`,
        { withCredentials: true }
      );
      const job = jobRes.data.job;
      setJobTitle(job.title);
      setJobCompany(job.company);
      setJobLocation(job.location);
      setJobType(job.type);
    };
    fetchData();
  }, [jobId]);

  return (
    <>
      <AdminNavbar />
      <div className="container my-5">
        <div className="mb-4 border-bottom pb-3">
          <h3 className="fw-bold mb-1">
            Applications for <span className="text-success">{jobTitle}</span>
          </h3>
          <div className="d-flex gap-3 flex-wrap align-items-center">
            {jobCompany && (
              <span className="badge bg-light text-dark border">
                <strong>Company:</strong> {jobCompany}
              </span>
            )}
            {jobLocation && (
              <span className="badge bg-light text-dark border">
                <strong>Location:</strong> {jobLocation}
              </span>
            )}
            {jobType && (
              <span className="badge bg-light text-dark border">
                <strong>Type:</strong> {jobType}
              </span>
            )}
            <span className="badge bg-success text-white fs-6 ms-auto">
              Total Applications: {applications.length}
            </span>
          </div>
        </div>

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
                    <p className="mb-1">
                      <strong>Phone:</strong> <a href={`tel:${app.phone}`}><FaPhoneAlt className="me-1" /> {app.phone}</a>
                    </p>
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
                        <a
                            href={`${API_URL}${app.resume}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-success btn-sm mt-1"
                          >
                          <FaDownload className="me-1" /> Download CV
                          </a>
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
};

export default AdminJobApplications;