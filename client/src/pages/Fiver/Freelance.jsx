import React from "react";
import FreelanceNavbar from "../Fiver/FreelanceNavbar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Freelance.css";
import freelancerbg from "../../assets/freelancerbg.png";
import seller1 from "../../assets/seller1.png";
import Footer from "../../layout/Footer.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
function Freelance() {
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchTopFreelancers = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/user/top-freelancers`,
        { withCredentials: true }
      );

      setFreelancers(data.freelancers);
      console.log("Top Freelancers:", data.freelancers);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGigs = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(`${API_URL}/api/v1/gigs`, {
        withCredentials: true,
      });

      setGigs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch gigs.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTopFreelancers();
    fetchGigs();
  }, [API_URL]);

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const categoryStats = gigs.reduce((acc, gig) => {
    const category = gig.category;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category]++;

    return acc;
  }, {});

  const differentCategoryGigs = gigs.reduce((acc, gig) => {
    const exists = acc.find((item) => item.category === gig.category);

    if (!exists) {
      acc.push(gig);
    }

    return acc;
  }, []);
  const categoryIcons = {
    "Web Development":
      "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg",

    "Graphic Design":
      "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg",

    "UI/UX Design":
      "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg",

    "Content Writing":
      "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg",

    "Digital Marketing":
      "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg",

    "Video & Animation":
      "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/video-animation.f0d9d71.svg",

    WordPress: "https://cdn-icons-png.flaticon.com/512/174/174881.png",

    "Logo Design": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };
  const navigate = useNavigate();
  return (
    <>
      <FreelanceNavbar />
      <div className=" fiver-section d-flex align-items-center">
        <div className="hero-circle-bg"></div>
        <div className="hero-dots-bg"></div>

        <div className="container-fluid position-relative">
          <div className="row align-items-center h-100">
            {/* LEFT SIDE */}
            <div className="col-lg-6 col-md-6 text-white hero-content">
              <h1 className="fw-bold hero-title ms-4">
                Find Expert <i>freelancer</i> <br /> For your Digital Projects
              </h1>

              <p className="fs-5 mt-3 fw-light ms-4 hero-subtitle">
                Hire skilled professionals or start selling your <br /> services
                on DevTech
              </p>

              {/* SEARCH BOX */}
              <div className="hero-search-box ms-3 mt-4">
                <input
                  type="text"
                  placeholder="Search services, skills or keywords..."
                />

                <button type="button" aria-label="Search">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>

              {/* POPULAR - SAME AS YOUR CODE */}
              <div className="mt-3 d-flex ms-4 align-items-center flex-wrap gap-2">
                <span className="fs-5 fw-bold">Popular :</span>

                <button className="btn btn-md rounded-pill mirror-btn">
                  Web Design
                </button>

                <button className="btn btn-md rounded-pill mirror-btn">
                  WordPress
                </button>

                <button className="btn btn-md rounded-pill mirror-btn">
                  Logo Design
                </button>

                <button className="btn btn-md rounded-pill mirror-btn">
                  AI Services
                </button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-6 col-md-6 hero-image-col">
              <img src={freelancerbg} alt="hero" className="fiver-imghero" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="container-fluid p-2"
        style={{ backgroundColor: "whitesmoke" }}
      >
        <div className="container d-flex align-items-center justify-content-center gap-3 flex-nowrap">
          <span
            className="fw-bold"
            style={{ fontSize: "clamp(12px, 2vw, 16px)", whiteSpace: "nowrap" }}
          >
            Trusted by:
          </span>

          <img
            src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/facebook2x.188a797.png"
            alt=""
            style={{
              height: "clamp(30px, 4vw, 55px)",
              objectFit: "contain",
              flexShrink: 1,
            }}
          />

          <img
            src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/google2x.06d74c8.png"
            alt=""
            style={{
              height: "clamp(25px, 4vw, 55px)",
              objectFit: "contain",
              flexShrink: 1,
            }}
          />

          <img
            src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/netflix2x.887e47e.png"
            alt=""
            style={{
              height: "clamp(25px, 4vw, 55px)",
              objectFit: "contain",
              flexShrink: 1,
            }}
          />

          <img
            src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/pandg2x.6dc32e4.png"
            alt=""
            style={{
              height: "clamp(25px, 4vw, 55px)",
              objectFit: "contain",
              flexShrink: 1,
            }}
          />

          <img
            src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/paypal2x.22728be.png"
            alt=""
            style={{
              height: "clamp(25px, 4vw, 55px)",
              objectFit: "contain",
              flexShrink: 1,
            }}
          />
        </div>
      </div>

      <div className="container explore mb-4 pb-1">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="fw-bold">Explore the marketplace</h2>
            <Link to="/gigs" className="btn fw-semibold">
              View all Category{" "}
              <i className="ms-1 bi bi-arrow-right-circle-fill"></i>
            </Link>
          </div>
          <div className="category-row mt-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <Link
                key={category}
                to={`/gigs?category=${encodeURIComponent(category)}`}
                className="text-decoration-none text-dark"
              >
                <div className="category-card">
                  <div className="category-icon">
                    <img
                      src={categoryIcons[category]}
                      alt={category}
                      className="h-100 w-100 p-2"
                    />
                  </div>

                  <h6>{category}</h6>
                  <p>{count} Gigs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container marketplace-section">
        {/* TOP FREELANCERS */}
        <div className="section-header">
          <h4>Top Freelancers</h4>
        </div>
        <div className="top-freelancers-row">
          {freelancers.slice(0, 4).map((freelancer) => (
            <div className="freelancer-card" key={freelancer._id}>
              <div className="freelancer-img-box">
                <img
                  src={
                    freelancer.avatar?.url ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt={freelancer.name}
                  className="freelancer-img"
                />
                <span className="online-dot"></span>
              </div>

              <div className="freelancer-info w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <Link
                    to={`/freelancers/${freelancer._id}`}
                    className="fw-bold text-decoration-none text-dark  d-flex align-items-center "
                    style={{ fontSize: "15px" }}
                  >
                    {freelancer.name}
                    <span className="verified-badge">✓</span>
                  </Link>

                  <small
                    style={{
                      background: "#00635d",
                      color: "#fff",
                      padding: "5px 6px",
                      borderRadius: "10px",
                      fontSize: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {freelancer.sellerLevel}
                  </small>
                </div>

                <p>
                  {freelancer.skills?.length > 0
                    ? freelancer.skills[0]
                    : "Freelancer"}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-1">
                  <div className="freelancer-rating">
                    <span className="star">★</span>
                    <strong>{Number(freelancer.rating || 0).toFixed(1)}</strong>
                  </div>

                  <small>
                    <strong>{freelancer.completedOrders || 0} </strong>
                    Orders
                  </small>

                  <small>
                    <strong>${freelancer.totalEarnings || 0}</strong>
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* POPULAR GIGS HEADER */}
        <div className="section-header gigs-header">
          <h4>Popular Gigs</h4>

          <Link className="view-all-btn text-decoration-none" to="/gigs">
            View All Gigs <span>↻</span>
          </Link>
        </div>

        {/* POPULAR GIGS */}
        <div className="popular-gigs-row">
          {differentCategoryGigs.slice(0, 8).map((gig) => (
            <div
              className="gig-card"
              key={gig._id}
              onClick={() => navigate(`/gigs/${gig._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="gig-img-box">
                <img src={gig.cover} alt={gig.title} className="w-100 h-100" />
              </div>

              <div className="gig-content">
                <med
                  style={{
                    color: "#00635d",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {gig.category}
                </med>

                <h5>
                  {gig.title?.length > 50
                    ? gig.title.slice(0, 50) + "..."
                    : gig.title}
                </h5>
                <div className="gig-rating">
                  <span className="star fs-5">★</span>
                  <strong className="fs-6">
                    {gig.starNumber > 0
                      ? (gig.totalStars / gig.starNumber).toFixed(1)
                      : "0.0"}
                  </strong>
                  <span className="fs-6">({gig.starNumber || 0})</span>
                </div>

                <div className="gig-footer">
                  <div className="seller-info">
                    <Link
                      to={`/freelancers/${gig.owner?._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-decoration-none d-flex align-items-center gap-2"
                    >
                      <img
                        src={
                          gig.owner?.avatar?.url ||
                          gig.owner?.avatar ||
                          "https://randomuser.me/api/portraits/men/32.jpg"
                        }
                        alt={gig.owner?.name}
                      />

                      <span className="fw-bold">{gig.owner?.name}</span>
                    </Link>
                  </div>

                  <p>
                    From <strong>${gig.packages?.basic?.price}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* HOW IT WORKS SECTION */}
      <div className="container how-it-works-section">
        <div className="container">
          <h4 className="how-title">How it works</h4>

          <div className="how-content">
            {/* LEFT SIDE STEPS */}
            <div className="how-steps">
              <div className="how-step">
                <div className="how-icon light-icon">
                  <i className="bi bi-search"></i>
                </div>

                <div>
                  <h5>1. Find</h5>
                  <p>
                    Search For The Perfect Service <br />
                    Or Freelancer For Your Project.
                  </p>
                </div>
              </div>

              <div className="how-step">
                <div className="how-icon">
                  <i className="bi bi-people"></i>
                </div>

                <div>
                  <h5>2. Collaborate</h5>
                  <p>
                    Communicate, Share Files And <br />
                    Work Together Smoothly.
                  </p>
                </div>
              </div>

              <div className="how-step">
                <div className="how-icon">
                  <i className="bi bi-clipboard-check"></i>
                </div>

                <div>
                  <h5>3. Get it Done</h5>
                  <p>
                    Review The Work And Release <br />
                    Payment Securely.
                  </p>
                </div>
              </div>

              <div className="how-step">
                <div className="how-icon">
                  <i className="bi bi-star-fill"></i>
                </div>

                <div>
                  <h5>4. Pay & Review</h5>
                  <p>
                    Pay Securely And Leave A Review <br />
                    To Help Others.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE CTA */}
            <div className="how-cta-wrapper">
              <div className="how-cta-box">
                <h3>Ready to Get Started ?</h3>
                <p>
                  Join our growing community today and <br />
                  unlock unlimited access to opportunities.
                </p>

                <button>Join Devtech - It’s Free</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Freelance;
