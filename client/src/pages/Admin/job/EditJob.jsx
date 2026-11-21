import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const EditJob = () => {
  const [image, setImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    experience: "",
    type: "",
    image: "",
  });

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/jobs/${id}`, {
          withCredentials: true,
        });
        setJobData(res.data.job);
      } catch (error) {
        console.error("Failed to fetch job", error);
      }
    };
    fetchJob();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated job data
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", jobData.title);
      formData.append("description", jobData.description);
      formData.append("company", jobData.company);
      formData.append("location", jobData.location);
      formData.append("experience", jobData.experience);
      formData.append("type", jobData.type);
      if (jobData.requirements) {
        formData.append(
          "requirements",
          Array.isArray(jobData.requirements)
            ? jobData.requirements.join(",")
            : jobData.requirements,
        );
      }

      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `${API_URL}/api/v1/jobs/edit-job/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      navigate("/admin/all-jobs");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h2>Edit Job</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={jobData.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload New Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={4}
              value={jobData.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Requirements (comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={
                Array.isArray(jobData.requirements)
                  ? jobData.requirements.join(",")
                  : ""
              }
              onChange={(e) =>
                setJobData({
                  ...jobData,
                  requirements: e.target.value.split(",").map((i) => i.trim()),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Company</label>
            <input
              type="text"
              name="company"
              className="form-control"
              value={jobData.company}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={jobData.location}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Experience</label>
            <input
              type="text"
              name="experience"
              className="form-control"
              value={jobData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type</label>

            <select
              className="form-control"
              name="type"
              value={jobData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            Update Job
          </button>
        </form>
      </div>
    </>
  );
};

export default EditJob;
