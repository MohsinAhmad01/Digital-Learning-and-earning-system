import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TeacherNavbar from "../TeacherAdmin/TeacherNavbar.jsx";
const API_URL = import.meta.env.VITE_API_URL;
const TeacherEditCourses = () => {
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
        const res = await axios.get(
          `${API_URL}/api/v1/courses/${id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
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
        toast.error(
          err.response?.data?.message ||
            "Failed to fetch course. Maybe it's not your course."
        );
        navigate("/teacher/my-courses"); // redirect teacher to their courses
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

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
        JSON.stringify(formData.tags.split(",").map((t) => t.trim()))
      );
      data.append(
        "skillsYouWillGain",
        JSON.stringify(
          formData.skillsYouWillGain.split(",").map((s) => s.trim())
        )
      );

      if (formData.image) data.append("image", formData.image);

      const res = await axios.put(
        `${API_URL}/api/v1/courses/edit/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Course updated successfully!");
        navigate("/teacher/my-courses");
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
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Review deleted successfully!");
        setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <>
        <TeacherNavbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <TeacherNavbar />
      <div className="container mt-5">
        <h2>Edit Course</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Form Fields */}
          {[
            { label: "Course Title", name: "title" },
            { label: "Category", name: "Catagory" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Prize", name: "prize" },
            { label: "Duration", name: "duration" },
            { label: "Level", name: "level" },
            { label: "Tags (comma separated)", name: "tags" },
            { label: "Skills You Will Gain (comma separated)", name: "skillsYouWillGain" },
          ].map((field) => (
            <div className="mb-3" key={field.name}>
              <label className="form-label">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              )}
            </div>
          ))}

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
            reviews.map((rev) => (
              <div
                key={rev._id}
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

export default TeacherEditCourses;
