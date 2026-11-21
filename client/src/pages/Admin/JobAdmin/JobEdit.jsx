import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import JobNavbar from "./JobNavbar";
const API_URL = import.meta.env.VITE_API_URL;
function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/jobs/${id}`);
        if (res.data.job) {
          const {
            title,
            company,
            location,
            experience,
            type,
            description,
            requirements,
          } = res.data.job;

          setFormData({
            title,
            company,
            location,
            experience,
            type,
            description,
            requirements: requirements || [],
          });
        }
      } catch (err) {
        toast.error("Failed to fetch job");
        navigate("/job/show-all");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImage(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const res = await axios.put(
        `${API_URL}/api/v1/jobs/edit-job/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Job updated successfully!");
        navigate("/job/show-all");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job");
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
      <div className="container mt-5 mb-5">
        <h2>Edit Job</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Company */}
          <div className="mb-3">
            <label className="form-label">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Type */}
          <div className="mb-3">
            <label className="form-label">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className="form-label">Job Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control"
              accept="image/*"
            />
          </div>

          {/* Requirements */}
          <div className="mb-3">
            <label className="form-label">
              Requirements (comma separated)
            </label>
            <input
              type="text"
              value={formData.requirements.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requirements: e.target.value
                    .split(",")
                    .map((item) => item.trim()),
                })
              }
              className="form-control"
              placeholder="React, Node, Teamwork"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Update Job
            </button>
            <button
              type="button"
              onClick={() => navigate("/job/show-all")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default JobEdit;