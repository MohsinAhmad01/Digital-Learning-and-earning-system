import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light  px-3 py-4 " style={{background: "linear-gradient(135deg, #064e4b, #0f766e)",}}>
      <div className="container-fluid">
        <span className="navbar-brand">
          <Link
            to="/"
            className="nav-link text-white fw-bolder"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
        </span>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="adminNavbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="adminNavbarNav"
        >
          <ul className="navbar-nav ms-auto">
            
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle text-white "
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Manage Courses
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item "
                    to="/admin/create-course"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add New Course
                  </Link>
                </li>
                <hr />
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/all-courses"
                    onClick={() => setMenuOpen(false)}
                  >
                    All Courses (Edit/Delete)
                  </Link>
                </li>
                <li>
                  <hr />
                  <Link
                    className="dropdown-item"
                    to="/admin/upload-video"
                    onClick={() => setMenuOpen(false)}
                  >
                    Upload Course Video
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle text-white "
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Manage Jobs
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/create-job"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add new Job
                  </Link>
                </li>
                <hr />
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/all-jobs"
                    onClick={() => setMenuOpen(false)}
                  >
                    All Jobs (Edit/Delete)
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle text-white "
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Manage Blogs
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/create-blog"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add New Blog
                  </Link>
                </li>
                <hr />
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/all-blogs"
                    onClick={() => setMenuOpen(false)}
                  >
                    All Blogs (Edit/Delete)
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle text-white "
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Manage Projects
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/create-project"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add New Project
                  </Link>
                </li>
                <hr />
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin/all-projects"
                    onClick={() => setMenuOpen(false)}
                  >
                    All Projects (Edit/Delete)
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/users"
                className="nav-link text-white "
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/orders"
                className="nav-link text-white "
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </Link>
            </li> */}
            {/* Add more links here */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
