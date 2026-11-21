import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/AdminNavbar.jsx";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/courses/allcourse`, {
        withCredentials: true,
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_URL}/api/v1/courses/${id}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center fw-bold mb-4">All Courses</h2>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-muted py-5">No courses found.</div>
        ) : (
          <div className="row">
            {courses.map((course) => (
              <div className="col-md-4 mb-4" key={course._id}>
                <div className="card h-100 shadow">
                  <img
                    src={
                      course.image
                        ? course.image.startsWith("http")
                          ? course.image
                          : `${API_URL}/api/uploads/${course.image}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    alt={course.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-primary">
                      {course.title}
                    </h5>
                    <p className="card-text">
                      {course.description?.slice(0, 100)}...
                    </p>
                    <p className="mb-1">
                      <strong>Prize:</strong> {course.prize}
                    </p>
                    <p className="mb-1">
                      <strong>Catagory:</strong> {course.Catagory}
                    </p>
                    <p className="mb-1">
                      <strong>Duration:</strong> {course.duration}
                    </p>
                    <p className="mb-2">
                      <strong>Level:</strong> {course.level}
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteCourse(course._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/admin/edit/${course._id}`)}
                      >
                        Edit
                      </button>
                    </div>
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
export default AllCourses;
