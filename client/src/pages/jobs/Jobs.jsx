import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../layout/Footer.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import card2 from "../../assets/card2.png"
function Jobs() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState("All Jobs");
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("Location");
  const [type, setType] = useState("Type");
  const [search, setSearch] = useState("");

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const params = {};
 if (job !== "All Jobs") params.category = job;
      if (location !== "Location") params.location = location;
      if (type !== "Type") params.type = type;
      if (search) params.keyword = search;

      const { data } = await axios.get(
        `${API_URL}/api/v1/jobs`,
        { params }
      );

      setJobs(data.jobs);
    const uniqueLocations = [
      "Location",
      ...new Set(data.jobs.map((j) => j.location).filter(Boolean)),
    ];

    setLocations(uniqueLocations);

    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [job,location, type, search]);

  return (
    <>
      <Navbar />

      {/* HERO SECTION - SAME */}
      <section
        className="text-center text-white py-5"
        style={{ backgroundColor: "#0e524e" }}
      >
        <div className="container px-3">
          <div className="d-flex justify-content-center ">
            <h6
              className="fw-bold d-inline-flex align-items-center gap-2 px-3 py-2 rounded-4"
              style={{ backgroundColor: "green" }}
            >
              We're Hiring
            </h6>
          </div>

          <h1 className="fw-bold display-6 display-md-5 mb-3">
            Find your dream job!
          </h1>

          <p className="lead fw-semibold px-2 px-md-0">
            Discover opportunities that match your skills, passion, and career goals. <br /> Explore top roles, connect with employers, and take the next step <br /> toward your dream job.
          </p>
        </div>
      </section>

      {/* FILTER SECTION - SAME UI */}
      <section className="container my-4 px-4">
        <div className="row g-4 align-items-center">

         {/* JOB CATEGORY
<div className="col-4 col-sm-6 col-md-3 col-lg-2">
  <div className="dropdown w-100">
    <button
      className="btn btn-success dropdown-toggle w-100"
      data-bs-toggle="dropdown"
    >
      {job}
    </button>

    <ul className="dropdown-menu w-100">
      {["All Jobs", "Developer", "Designer", "Marketing", "Sales"].map(
        (item) => (
          <li key={item}>
            <button
              className="dropdown-item"
              onClick={() => setJob(item)}
            >
              {item}
            </button>
          </li>
        )
      )}
    </ul>
  </div>
</div> */}
 {/* LOCATION */}
          <div className="col-4 col-sm-6 col-md-3 col-lg-2">
            <div className="dropdown w-100">
              <button
                className="btn btn-success dropdown-toggle w-100"
                data-bs-toggle="dropdown"
              >
                {location}
              </button>
              <ul className="dropdown-menu w-100">
                {locations.map((item) => (
  <li key={item}>
    <button
      className="dropdown-item"
      onClick={() => setLocation(item)}
    >
      {item}
    </button>
  </li>
))}
              </ul>
            </div>
          </div>

          {/* TYPE */}
          <div className="col-4 col-sm-6 col-md-3 col-lg-2">
            <div className="dropdown w-100">
              <button
                className="btn btn-success dropdown-toggle w-100"
                data-bs-toggle="dropdown"
              >
                {type}
              </button>
              <ul className="dropdown-menu w-100">
                {["Type", "Full Time", "Part Time", "Internship"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        className="dropdown-item"
                        onClick={() => setType(item)}
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* SEARCH */}
          <div className="col-12 col-md-6 col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search for your dream job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* JOB CARDS - SAME DESIGN */}
      <div className="container my-5 px-3">
        <div className="row g-4">
          {jobs.map((job) => (
  <div key={job._id} className="col-lg-4 col-md-6 col-sm-12">
    <div
      className="h-100 d-flex flex-column"
      style={{
        border: "2px solid #d1d5db",
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* ================= TOP IMAGE SECTION ================= */}
      <div
        className="position-relative flex-grow-1"
        style={{
          backgroundImage: `url(${
  job.image
    ? `${API_URL}${job.image}`
    : card2
})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "200px",
        }}
      >
        {/* TITLE */}
        

        {/* TAG + DATE */}
        <div className="d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 p-2">
          <span
            style={{
              backgroundColor: "#d9f99d",
              color: "#14532d",
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            {job.company}
          </span>

          <small className="text-white fw-bold ">
            {new Date(job.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>

      {/* ================= DETAILS SECTION ================= */}
      <div className="p-1">
        <h4 className="ms-2 fw-bold ">
          {job.title}
        </h4>
<p className="card-text ms-3">
  {job.description.length > 40
    ? job.description.substring(0, 40) + "..."
    : job.description}
</p>
        <div className="d-flex justify-content-between flex-wrap small mb-2">
          <span className="border border-1 rounded p-1 me-2 flex-grow-1 text-center">
            <i className="bi bi-geo-alt me-2"></i>
            {job.location}
          </span>
          <span className="border border-1 rounded p-1 flex-grow-1 text-center">
            <i className="bi bi-briefcase me-2"></i>
            {job.type}
          </span>
        </div>

        <div className="d-flex justify-content-center align-items-center small">
          <span className="border border-1 rounded p-1 me-2 text-center">
            <i className="bi bi-airplane-fill me-2"></i>
            {" "}{job.experience}
          </span>

          <span className="border border-1 rounded p-1  text-center">
            <i className="bi bi-house-door me-1"></i>
            {job.company}
          </span>
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <div className="p-3">
        <Link
          to={`/jobs/${job._id}`}
          className="w-100 text-white border-0 d-block text-center text-decoration-none"
          style={{
            backgroundColor: "#064e3b",
            padding: "8px",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          Apply <i className="bi bi-send ms-1"></i>
        </Link>
      </div>
    </div>
  </div>
))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Jobs;