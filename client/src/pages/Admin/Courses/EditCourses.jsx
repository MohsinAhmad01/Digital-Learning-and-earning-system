import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/AdminNavbar.jsx";
const API_URL = import.meta.env.VITE_API_URL;
const EditCourses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    duration: "",
    level: "",
    image: null,
    Catagory: "",
    tags: "",
    skillsYouWillGain: "",
  });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/courses/${id}`);
        if (res.data.course) {
          const {
            title,
            description,
            prize,
            duration,
            level,
            Catagory,
            tags,
            skillsYouWillGain,
            reviews,
          } = res.data.course;

          setFormData({
            title,
            description,
            prize,
            duration: duration || "",
            level: level || "",
            Catagory,
            tags: tags?.join(",") || "",
            skillsYouWillGain: skillsYouWillGain?.join(",") || "",
            image: null,
          });
          setReviews(reviews || []);
        }
      } catch (err) {
        toast.error("Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("prize", formData.prize);
      data.append("duration", formData.duration);
      data.append("level", formData.level);
      data.append("Catagory", formData.Catagory);
      data.append(
        "tags",
        JSON.stringify(formData.tags.split(",").map((t) => t.trim())),
      );
      data.append(
        "skillsYouWillGain",
        JSON.stringify(
          formData.skillsYouWillGain.split(",").map((s) => s.trim()),
        ),
      );

      if (formData.image) data.append("image", formData.image);

      const res = await axios.put(
        `${API_URL}/api/v1/courses/edit/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Course updated successfully!");
        navigate("/admin/all-courses");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/courses/${id}/review/${reviewId}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Review deleted successfully!");
        // Remove the deleted review from state
        setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h2>Edit Course</h2>
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
            <label className="form-label">
              Skills You Will Gain (comma separated)
            </label>
            <input
              type="text"
              name="skillsYouWillGain"
              value={formData.skillsYouWillGain}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update Course
          </button>
        </form>

        {/* Reviews */}
        <div className="mt-5">
          <h4>Reviews ({reviews.length})</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((rev, idx) => (
              <div
                key={idx}
                className="border p-2 mb-2 d-flex justify-content-between align-items-center"
              >
                <div>
                  <p>
                    <strong>User:</strong> {rev.user?.name || "Anonymous"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {rev.rating}
                  </p>
                  <p>
                    <strong>Comment:</strong> {rev.comment || "No comment"}
                  </p>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteReview(rev._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default EditCourses;
