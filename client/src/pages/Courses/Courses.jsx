import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../layout/Footer.jsx";
import { Link } from "react-router-dom";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const filters = [
    "All Courses",
    "Ui/Ux Designing",
    "Web Development",
    "Video Editing",
    "Article Writing",
    "digital Marketing",
  ];

  // ✅ FETCH COURSES FROM BACKEND
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/courses`);

        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    fetchCourses();
  }, []);

  // ✅ CATEGORY + SEARCH FILTER
  const filteredCourses = courses.filter((course) => {
    const matchCategory =
      activeFilter === "All Courses" || course.Catagory === activeFilter;

    const matchSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section>
        <div
          className="text-center text-white py-5"
          style={{ backgroundColor: "#0d6862" }}
        >
          <h1 className="fw-bolder py-4">Developer Tech – All Courses</h1>
          <p className="lead">
            This platform’s simplicity belies its powerful capabilities,
            offering a <br /> seamless and enjoyable educational experience.
          </p>
        </div>

        {/* FILTER + SEARCH */}
        <div className="container my-5">
          <h3 className="mb-3 fw-bold">Explore Our Courses</h3>
          <p className="mb-4">
            Choose from hundreds of courses and start learning today
          </p>

          <div className="d-flex gap-2 flex-wrap mb-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm ${
                  activeFilter === filter ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search courses by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <div className="container my-5">
        <h2 className="mb-4 fw-bold">All Courses</h2>

        <div className="row g-4">
          {filteredCourses.map((course) => (
            <div key={course._id} className="col-md-4">
              <div className="card h-100 border-0 shadow rounded-4 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column p-4">
                  <h5 className="fw-bold mb-3">{course.title}</h5>

                  <div className="d-flex justify-content-between align-items-center text-muted mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <span>
                        <i className="bi bi-clock me-1"></i>
                        {course.duration}
                      </span>

                      <span className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Certificate
                      </span>
                    </div>

                    {/* ⭐ AVERAGE RATING */}
                    <span className="text-warning fw-semibold">
                      ★ {course.averageRating || "0.0"}
                    </span>
                  </div>

                  <Link
                    to={`/courses-details/${course._id}`}
                    className="btn btn-success fw-semibold py-2 rounded-3 mt-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <p className="text-center text-muted mt-4">No courses found</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Courses;
