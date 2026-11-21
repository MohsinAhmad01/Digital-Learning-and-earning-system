import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar.jsx";
const API_URL = import.meta.env.VITE_API_URL;
const CreateCourses = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    image: null,
    duration: "",
    level: "",
    Catagory: "",
    tags: "",
    skillsYouWillGain: "",
    
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("prize", formData.prize);
    form.append("duration", formData.duration);
    form.append("level", formData.level);
    form.append("image", formData.image);
    form.append("Catagory", formData.Catagory);
    form.append("tags", formData.tags);
    form.append("skillsYouWillGain", formData.skillsYouWillGain);

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/courses/create`,
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        toast.success("Course created successfully!");
        navigate("/admin/all-courses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2>Create Course</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="Catagory"
              value={formData.Catagory}
              onChange={handleChange}
              className="form-control"
              required
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
              required
            ></textarea>
          </div>

          {/* Prize */}
          <div className="mb-3">
            <label className="form-label">Prize</label>
            <input
              type="text"
              name="prize"
              value={formData.prize}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control"
              accept="image/*"
              required
            />
          </div>

          {/* Duration */}
          <div className="mb-3">
            <label className="form-label">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Level */}
          <div className="mb-3">
            <label className="form-label">Level</label>
            <input
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Tags */}
          <div className="mb-3">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Skills */}
          <div className="mb-3">
            <label className="form-label">Skills You Will Gain (comma separated)</label>
            <input
              type="text"
              name="skillsYouWillGain"
              value={formData.skillsYouWillGain}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Course
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateCourses;
