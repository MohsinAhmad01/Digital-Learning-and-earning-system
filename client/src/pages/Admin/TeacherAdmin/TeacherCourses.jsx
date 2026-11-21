import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TeacherNavbar from "./TeacherNavbar";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch teacher's own courses
  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/courses/my-courses`, {
        withCredentials: true,
      });
      setCourses(res.data.courses || []);
    } catch (error) {
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // Delete a course
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${API_URL}/api/v1/courses/${courseId}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully!");
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  return (
    <>
      <TeacherNavbar />

      <div className="container mt-4">
        <h2 className="fw-bold mb-4 text-center">My Courses</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <h4 className="fw-bold mb-2">No Courses Yet</h4>
            <p className="text-muted mb-4">
              You haven’t created any courses yet. Start sharing your knowledge!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/teacher/create-course")}
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="row">
            {courses.map((course) => (
              <div className="col-md-4 mb-4" key={course._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={
                      course.image
                        ? course.image
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    alt={course.title}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold text-primary">{course.title}</h5>
                    <p className="text-muted small">
                      {course.description?.slice(0, 90)}...
                    </p>

                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(`/teacher/edit-course/${course._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          navigate(`/courses-details/${course._id}`)
                        }
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() =>
                          navigate(`/teacher/course/${course._id}/videos`)
                        }
                      >
                        Manage Videos
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(course._id)}
                      >
                        Delete
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
}

export default TeacherCourses;
