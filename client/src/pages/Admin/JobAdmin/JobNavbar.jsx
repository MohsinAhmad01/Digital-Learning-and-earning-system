import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function JobNavbar() {
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
          Home
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
              to="/job/dashboard"
              className="nav-link text-white fw-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Job Dashboard
            </Link>
            <Link
              to="/job/create"
              className="nav-link text-white fw-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Add New Job
            </Link>
            
            <Link
              to="/job/show-all"
              className="nav-link text-white fw-semibold"
              onClick={() => setMenuOpen(false)}
            >
              My Jobs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default JobNavbar;
