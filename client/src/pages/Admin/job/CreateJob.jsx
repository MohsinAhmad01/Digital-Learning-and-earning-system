import React, { useState } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    experience: "",
    type: "",
    description: "",
    requirements: [],
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("company", formData.company);
      data.append("location", formData.location);
      data.append("experience", formData.experience);
      data.append("type", formData.type);
      data.append("description", formData.description);
      if (formData.requirements?.length) {
        data.append("requirements", formData.requirements.join(","));
      }
      if (image) {
        data.append("image", image);
      }

      await axios.post(`${API_URL}/api/v1/jobs`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Job created successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2>Create New Job</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Job Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Job Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label>Company</label>
            <input
              type="text"
              className="form-control"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>experience</label>
            <input
              type="text"
              className="form-control"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>

            <select
              className="form-control"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Requirements (comma separated)</label>

            <input
              type="text"
              className="form-control"
              placeholder="React, Node, Teamwork"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requirements: e.target.value
                    .split(",")
                    .map((item) => item.trim()),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateJob;
