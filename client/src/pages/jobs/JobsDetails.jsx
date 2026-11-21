import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import vibeandculture from "../../assets/vibeandculture.jpeg";
import JobApply from "./JobApply";

const JobsDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/jobs/${id}`);
        setJob(res.data.job);
      } catch (error) {
        console.error("Failed to fetch job", error);
      }
    };
    fetchJob();
  }, [id]);

  if (!job)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar />

      {/* HERO IMAGE: style to fit on all screens */}
     <div className="container-fluid p-0 mb-3">
         <img
  src={vibeandculture}
  alt="Hero"
  style={{
    width: "100%",
    height: "auto",
    maxHeight: "50vh",
    display: "block",
    objectFit: "contain",
  }}
/>
        </div>

      {/* JOB DETAILS CARD */}
      <div
        className="container"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 .2rem"
        }}
      >
        <div
          className="bg-white shadow-sm border mb-5 p-3 p-md-4 rounded-4 position-relative"
          style={{ minHeight: "320px" }}
        >
          {/* Title, Company */}
          <div
            className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 align-items-sm-center mb-2"
          >
            <span className="fw-bold" style={{
              fontSize: 28, lineHeight: 1.08, letterSpacing: ".02em"
            }}>
              {job.title}
            </span>
            {job.company && (
              <span
                style={{
                  backgroundColor: "#eaffb9",
                  color: "#222",
                  fontSize: 16,
                  fontWeight: 500,
                  borderRadius: 8,
                  padding: "6px 16px",
                  marginTop: 2,
                  display: "inline-block",
                }}
              >{job.company}</span>
            )}
          </div>

          {/* Meta Info Tags */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {job.location && (
              <span
                className="d-inline-flex align-items-center"
                style={{
                  
                  color: "#000000",
                  fontWeight: 500,
                  borderRadius: 7,
                  padding: "4px 15px",
                  fontSize: 15,
                  border: "2px solid #e2ffe0"
                }}
              ><span role="img" aria-label="location">📍</span>
          {job.location}
        </span>
            )}
            {job.type && (
              <span
                className="d-inline-flex align-items-center"
                style={{
                  
                  color: "#000000",
                  fontWeight: 500,
                  borderRadius: 7,
                  padding: "4px 15px",
                  fontSize: 15,
                  border: "2px solid #e2ffe0"
                }}
              >
                🕒 {job.type}
              </span>
            )}
            {job.experience && (
              <span
                className="d-inline-flex align-items-center"
                style={{
                  
                  color: "#000000",
                  fontWeight: 500,
                  borderRadius: 7,
                  padding: "4px 15px",
                  fontSize: 15,
                  border: "2px solid #e2ffe0"
                }}
              >
                💼 {job.experience}
              </span>
            )}
            {/* Optional Remote Tag */}
            {job.location && job.location.toLowerCase().includes("remote") && (
              <span
                className="d-inline-flex align-items-center"
                style={{
                  background: "#f8f9fa",
                  color: "#007bff",
                  fontWeight: 500,
                  borderRadius: 99,
                  padding: "4px 15px",
                  fontSize: 15,
                  border: "1px solid #cce3e6"
                }}
              >
                Remote
              </span>
            )}
          </div>

          {/* Job Description */}
          {job.description &&
            <div className="mb-3" style={{ color: "#222", fontSize: 16, lineHeight: 1.6 }}>
              {job.description}
            </div>
          }

          {/* About this job Responsibilities */}
          {job.about && (
            <div className="mb-3">
              <div className="fw-bold mb-2" style={{ fontSize: 16, color: "#103f20" }}>
                About this jobs
              </div>
              <ul className="mb-3 ps-4" style={{ color: "#445e55", fontSize: 15, lineHeight: 1.8 }}>
                {job.about.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-1 mt-3">
              <div className="fw-bold mb-2" style={{ fontSize: 16, color: "#103f20" }}>
                Mandatory requirement
              </div>
              <ul className="mb-0 ps-4" style={{ color: "#445e55", fontSize: 15, lineHeight: 1.8 }}>
                {job.requirements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Bar - Responsive */}
          <div
            className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-2 gap-md-0"
            style={{
              background: "#f5f9f8",
              borderTop: "1px solid #e0e0e0",
              margin: "2.5rem -1.5rem -1.5rem -1.5rem",
              padding: "1.25rem 1rem",
              borderRadius: "0 0 20px 20px"
            }}
          >
            <a
              href="#"
              className="text-decoration-none d-flex align-items-center gap-1 fw-semibold"
              style={{ color: "#17924a", fontSize: 13 }}
            >
              <span >Explore our Culture </span>
              
            </a>
            <div className="d-flex gap-4 w-100 w-md-auto mt-2 mt-md-0 justify-content-md-end">
              <button
                className="btn btn-light border flex-fill flex-md-shrink-0"
                style={{ minWidth: 90, fontWeight: 500 }}
                onClick={() => navigate("/jobs")}
              >
                Close
              </button>
              <button
                className="btn flex-fill flex-md-shrink-0"
                onClick={() => setShowApply(true)}
                style={{
                  background: "#55de37",
                  color: "#ffffff",
                  fontWeight: 600,
                  minWidth: 100,
                  borderRadius: 7,
                  fontSize: "1.08rem"
                }}
              >
                Apply →
              </button>
              <JobApply show={showApply} onHide={() => setShowApply(false)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsDetails;