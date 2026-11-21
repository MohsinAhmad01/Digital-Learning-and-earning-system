import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function TeacherNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="navbar navbar-expand-lg px-3 py-4"
      style={{ background: "linear-gradient(135deg, #064e4b, #0f766e)" }}
    >
      <div className="container-fluid">
        {/* Brand / Home */}
        <Link
          to="/"
          className="navbar-brand text-white fw-bolder"
          onClick={() => setMenuOpen(false)}
        >
          Teacher Dashboard
        </Link>
        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <div className="ms-auto d-flex flex-column flex-lg-row gap-3">
            <Link
              to="/teacher/create-course"
              className="nav-link text-white fw-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Add Course
            </Link>

            <Link
              to="/teacher/my-courses"
              className="nav-link text-white fw-semibold"
              onClick={() => setMenuOpen(false)}
            >
              My Courses
            </Link>

            <Link
              to="/teacher/upload-video"
              className="nav-link text-white fw-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Upload Video
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TeacherNavbar;
