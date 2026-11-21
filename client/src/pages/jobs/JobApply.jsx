import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaLinkedin, FaFileUpload } from "react-icons/fa";

const formLabel = { fontWeight: 600, marginBottom: 3 };
const requiredDot = <span className="text-danger">*</span>;

const inputStyle = {
  background: "#f8fafc",
  borderRadius: 8,
  borderColor: "#e5e7eb",
};

const JobApply = ({ show, onHide }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    linkedin: "",
    fullName: "",
    email: "",
    phone: "",
    company: "",
    portfolio: "",
    website: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileInput = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const data = new FormData();
      for (let key in form) data.append(key, form[key]);
      data.append("resume", resume);
      data.append("job", id);

      await axios.post(`${API_URL}/api/v1/applications`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Application submitted! Redirecting...");
      setTimeout(() => {
        setMsg("");
        onHide();
        navigate("/jobs");
      }, 1300);
    } catch (err) {
      setMsg("Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body className="p-4" style={{ borderRadius: 16, background: "#f2fff6" }}>
        <div className="mb-4 text-center">
          <h4 className="fw-bold" style={{ color: "#17924a" }}>
            Application Form
          </h4>
          <p className="text-secondary">
            Fill the details carefully. Fields marked with <span className="text-danger">*</span> are required.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* LinkedIn & CV */}
            <div className="col-md-6">
              <label style={formLabel}>Connect LinkedIn</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><FaLinkedin className="text-primary" /></span>
                <input
                  name="linkedin"
                  className="form-control"
                  style={inputStyle}
                  placeholder="LinkedIn profile (optional)"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label style={formLabel}>Attach Resume/CV {requiredDot}</label>
              <div className="input-group">
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.odt,.rtf,image/*"
                  className="form-control"
                  style={inputStyle}
                  onChange={handleFileInput}
                />
                <span className="input-group-text bg-white">
                  <FaFileUpload />
                </span>
              </div>
              {resume && (
                <div className="small text-success mt-1">
                  Selected: {resume.name}
                </div>
              )}
            </div>

            {/* Names, Email, Phone */}
            <div className="col-md-6">
              <label style={formLabel}>Full Name {requiredDot}</label>
              <input
                name="fullName"
                required
                className="form-control"
                style={inputStyle}
                placeholder="Your full name"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label style={formLabel}>Email {requiredDot}</label>
              <input
                name="email"
                required
                type="email"
                className="form-control"
                style={inputStyle}
                placeholder="Email address"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label style={formLabel}>Phone Number {requiredDot}</label>
              <input
                name="phone"
                required
                className="form-control"
                style={inputStyle}
                placeholder="e.g. +92-300-1234567"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label style={formLabel}>Last/Current Company</label>
              <input
                name="company"
                className="form-control"
                style={inputStyle}
                placeholder="Company (optional)"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label style={formLabel}>Portfolio Website</label>
              <input
                name="portfolio"
                className="form-control"
                style={inputStyle}
                placeholder="https://"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label style={formLabel}>Other Website</label>
              <input
                name="website"
                className="form-control"
                style={inputStyle}
                placeholder="https://"
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label style={formLabel}>Additional Information / Cover Letter</label>
              <textarea
                name="coverLetter"
                className="form-control"
                style={inputStyle}
                rows={3}
                placeholder="Add a cover letter or any note (optional)"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-5 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
            <Button
              variant="success"
              type="submit"
              disabled={loading}
              style={{
                minWidth: 130,
                borderRadius: 8,
                background: "#3cb46e",
                fontWeight: 600,
                fontSize: "1.1rem"
              }}
            >
              {loading ? "Applying..." : "Apply"}
            </Button>
          </div>
          {msg && <div className="alert alert-info mt-3 text-center">{msg}</div>}
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default JobApply;