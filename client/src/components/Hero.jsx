import { useContext } from "react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Hero.css";
import { Context } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import mainimg from "../assets/main-img.png";
import readystart from "../assets/readystart.png";
import seller1 from "../assets/seller1.png";
import seller2 from "../assets/seller2.png";
import seller3 from "../assets/seller3.png";
import doubt1 from "../assets/doubt1.png";
import doubt2 from "../assets/doubt2.png";
import doubt3 from "../assets/doubt3.png";
import card1 from "../assets/card1.png";
import card2 from "../assets/card2.png";
import card3 from "../assets/card3.png";
import Mohsin from "../assets/mohsin.png";
import Bashir from "../assets/bashir.jpeg";
import Aiimg from "../assets/ai.png";
import courseImg from "../assets/courseImage.png";
import digitalMarketing from "../assets/digitalMarketing.png";
import Graphic from "../assets/Graphic.png";
import Cartoonani from "../assets/Cartoonani.png";
import Illustration from "../assets/Illustration.png";
import Voucher from "../assets/Voucher.png";
import Logodesign from "../assets/Logodesign.png";
import SocialMedia from "../assets/SocialMedia.png";
import ArticleWriting from "../assets/ArticleWriting.png";
import VideoEditing from "../assets/VideoEditing.png";

const Hero = () => {
  const { user } = useContext(Context);
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/blogs`);

        if (res.data.success) {
          setBlogs(res.data.blogs.slice(0, 3)); // latest 3 blogs
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlogs();
  }, []);
  const fetchTopCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/courses`);

      const topCourses = (data.courses || [])
        .sort((a, b) => {
          const viewDiff = (b.views || 0) - (a.views || 0);
          if (viewDiff !== 0) return viewDiff;

          const reviewDiff =
            (b.reviews?.length || 0) - (a.reviews?.length || 0);
          if (reviewDiff !== 0) return reviewDiff;

          return (
            parseFloat(b.averageRating || 0) - parseFloat(a.averageRating || 0)
          );
        })
        .slice(0, 3);
      setCourses(topCourses);
    } catch (error) {
      console.log("Status:", error.response?.status);
    }
  };
  const fetchTopFreelancers = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/user/top-freelancers`
      );

      setFreelancers(data.freelancers);
      console.log("Top Freelancers:", data.freelancers);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/jobs`);
      const sortedJobs = data.jobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setJobs(sortedJobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopCourses();
    fetchTopFreelancers();
    fetchJobs();
  }, []);
  return (
    <>
      <div style={{ backgroundColor: "#0d6862" }}>
        <Navbar />
        <section
          style={{
            background: "linear-gradient(135deg, #064e4b, #0f766e)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div className="container-fluid px-lg-5">
            <div className="row align-items-center">
              {/* LEFT CONTENT */}
              <div className="col-lg-6 px-lg-5 text-center text-lg-start">
                <h1 className="fw-bold display-3 mb-2 mt-2">DevTechs</h1>

                <h5
                  className="fw-semibold mb-3 display-7 "
                  style={{ letterSpacing: "2px" }}
                >
                  LEARN – WORK – GROW
                </h5>

                <p className="opacity-75 mb-2" style={{ maxWidth: "520px" }}>
                  Empowering You To Gain Skills, Hire Experts, And Build Your
                  Career — All In One Platform.
                </p>

                <p
                  className="small opacity-50 mb-4"
                  style={{ maxWidth: "520px" }}
                >
                  Transform Your Career With Cutting-Edge Courses, Connect With
                  Top Service Providers, And Collaborate On Innovative Projects.
                </p>

                {/* SEARCH */}
                <div
                  className="position-relative bg-white rounded-pill mb-4 mx-auto mx-lg-0"
                  style={{ maxWidth: "500px", height: "45px" }}
                >
                  <input
                    type="text"
                    className="form-control border-0 shadow-none rounded-pill"
                    placeholder="Search To Find Courses, Jobs, Or Services"
                    style={{
                      height: "45px",
                      paddingRight: "51px", // button ke liye space
                    }}
                  />

                  <button
                    className="btn position-absolute top-50 end-0 translate-middle-y  rounded-circle text-white"
                    style={{
                      backgroundColor: "#3b82f6",
                      width: "48px",
                      height: "50px",
                    }}
                  >
                    <i className="bi bi-search text-white fw-bolder"></i>
                  </button>
                </div>

                <p className="small opacity-75 me-2">TRENDING SERVICES</p>
                {/* TRENDING */}
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
                  {["DESIGNER", "DEVELOPER", "SEO Optimization"].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-pill small"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {item}{" "}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="col-lg-6 text-center mt-5 mt-lg-3">
                <img
                  src={mainimg} // <-- replace with your image
                  alt="Hero"
                  className="img-fluid"
                  style={{
                    maxHeight: "800px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-5 bg-white">
          <div className="container-fluid px-lg-5">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Our Most Popular Courses</h2>

              <Link
                to={"/courses"}
                className="text-decoration-none fw-semibold d-flex align-items-center gap-2"
                style={{ color: "#3b82f6" }}
              >
                View All <span style={{ fontSize: "20px" }}>→</span>
              </Link>
            </div>

            {/* COURSES */}
            <div className="row g-4">
              {courses.map((course) => (
                <div className="col-lg-4 col-md-6" key={course._id}>
                  <div
                    className="card h-100 border-0"
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body">
                      <h6 className="fw-semibold mb-3">{course.title}</h6>

                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>⏱ {course.duration}</span>
                        <span>👁 {course.views || 0}</span>
                      </div>

                      <div className="small text-muted mb-3">
                        ⭐ {course.averageRating || "0.0"} (
                        {course.reviews?.length || 0} reviews)
                      </div>

                      <Link
                        to={`/courses-details/${course._id}`}
                        className="btn w-100 text-white"
                        style={{ backgroundColor: "#0f5f2a" }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5" style={{ background: "#144b4a" }}>
          <div className="container">
            {/* Heading */}
            <div className="text-center text-white mb-5">
              <h1 className="fw-bold " style={{ fontFamily: "Calligraphic" }}>
                Everything You Need to Succeed
              </h1>
              <p className="opacity-75 ">
                A comprehensive platform designed to accelerate your
                professional growth
              </p>
            </div>

            {/* Cards */}
            <div className="row g-4">
              {/* Card 1 */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="bg-white h-100 p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#7b61ff",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-book"></i>
                    </div>
                    <h6 className="fw-bold mb-0">Expert-Led Courses</h6>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Learn from industry experts with hands-on projects and
                    real-world applications
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="bg-white h-100 p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#e056fd",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-people fw-bold fs-4"></i>
                    </div>

                    <h6 className="fw-bold mb-0">Service Marketplace</h6>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Connect with verified professionals for design, development,
                    and consulting services
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="bg-white h-100 p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#ff4757",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <h6 className="fw-bold mb-0">Career Growth</h6>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Access exclusive job opportunities and build your
                    professional portfolio
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="bg-white h-100 p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#2ed573",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-award"></i>
                    </div>
                    <h6 className="fw-bold mb-0">Certifications</h6>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Earn industry-recognized certificates to showcase your
                    expertise
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="bg-white h-100 p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#1e90ff",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-globe-americas"></i>
                    </div>
                    <h6 className="fw-bold mb-0">Global Community</h6>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Join a worldwide network of learners, creators, and
                    innovators
                  </p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="bg-white h-100 p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#ff7f50",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-file-lock-fill fs-4"></i>
                    </div>
                    <h6 className="fw-bold mb-0">Secure Platform</h6>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Enterprise-grade security to protect your data and
                    transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5 bg-white">
          <div className="container">
            {/* Heading */}
            <h2 className="fw-bold mb-4">
              Here are Something You’d Need to Learn
            </h2>

            {/* Categories */}
            <div className="row g-4">
              {/* Item 1 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={Graphic}
                    alt="Graphic & Design"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Graphic & Design
                    </h4>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={Cartoonani}
                    alt="Cartoon Animation"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Cartoon Animation
                    </h4>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={Illustration}
                    alt="Illustration"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Illustration
                    </h4>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={Voucher}
                    alt="Flyers & Vouchers"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Flyers & Vouchers
                    </h4>
                  </div>
                </div>
              </div>
              {/* Item 5 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={Logodesign}
                    alt="Logo Design"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">Logo Design</h4>
                  </div>
                </div>
              </div>
              {/* Item 6 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={SocialMedia}
                    alt="Social Graphics"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Social graphics
                    </h4>
                  </div>
                </div>
              </div>

              {/* Item 7 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={ArticleWriting}
                    alt="Article Writing"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Article writing
                    </h4>
                  </div>
                </div>
              </div>

              {/* Item 8 */}
              <div className="col-lg-3 col-md-6 col-12">
                <div
                  className="position-relative rounded-4 overflow-hidden"
                  style={{ height: 140 }}
                >
                  <img
                    src={VideoEditing}
                    alt="Video Editing"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center ps-3"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <h4 className="text-white fw-semibold mb-0">
                      Video Editing
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* More Categories */}
            <div className="text-center mt-4">
              <Link
                to="/freelance"
                className="btn btn-link text-decoration-none fw-semibold"
              >
                More Categories <i className=" bi bi-chevron-double-down"></i>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <section className="container bg-white my-5">
        <div
          className="d-flex align-items-center justify-content-center text-center text-white rounded-4 p-4 p-md-5"
          style={{
            backgroundImage: `url(${readystart})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "320px",
          }}
        >
          <div className="col-12 col-md-8">
            <h2 className="fw-bold mb-3">Ready to Get Started ?</h2>

            <p className="mb-4">
              Join our growing community today and unlock unlimited access to
              courses, services, and opportunities.
            </p>

            <button className="btn btn-primary px-4 py-2 fw-bolder">
              Get Started it’s Free
            </button>
          </div>
        </div>
      </section>
      <section className="container my-5">
        {/* Section Title */}
        <div className="mb-4">
          <h3 className="fw-bold">
            Trending <span className="text-primary">Sellers</span>
          </h3>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {freelancers.slice(0, 3).map((freelancer) => (
            <div key={freelancer._id} className="col-12 col-md-4">
              <Link
                to={`/freelancers/${freelancer._id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <img
                    src={freelancer.avatar?.url}
                    className="card-img-top rounded-top-4"
                    alt={freelancer.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />

                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">{freelancer.name}</h6>

                      <small className="text-muted">
                        {freelancer.bio?.length > 50
                          ? freelancer.bio.slice(0, 50) + "..."
                          : freelancer.bio}
                      </small>
                    </div>

                    <span className="text-primary fs-4 fw-bold bi bi-arrow-right"></span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Slider Indicators (UI only) */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          <span
            className="bg-primary rounded-pill"
            style={{ width: 18, height: 4 }}
          />
          <span
            className="bg-secondary rounded-pill opacity-50"
            style={{ width: 10, height: 4 }}
          />
          <span
            className="bg-secondary rounded-pill opacity-50"
            style={{ width: 10, height: 4 }}
          />
        </div>
      </section>
      <section className="py-5" style={{ backgroundColor: "#184c4a" }}>
        <div className="container">
          <h2 className="text-white fw-bold mb-5">
            Have Some Doubts To Get Started ?
          </h2>

          <div className="row g-4 mb-5">
            {blogs.map((blog) => (
              <div className="col-12 col-md-4" key={blog._id}>
                <div className="card h-100 border-0 rounded-4 shadow-sm">
                  <img
                    src={blog.coverImage}
                    className="card-img-top rounded-top-4"
                    alt={blog.title}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <small className="text-muted mb-2">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </small>

                    <h5 className="fw-semibold mb-3">{blog.title}</h5>

                    <p className="text-muted small mb-3">
                      {blog.shortDescription?.slice(0, 100)}...
                    </p>

                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="text-primary text-decoration-none fw-semibold mt-auto"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/blogs"
              className="text-decoration-none bg-primary text-white rounded-3 px-4 py-2 fw-semibold"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </section>
      <div className="container my-5">
        {/* ================= TESTIMONIALS ================= */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">What Our Users Say</h2>
          <p className="text-muted">
            Join thousands of satisfied learners and professionals
          </p>
        </div>

        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-lg-4 col-md-6">
            <div
              className="p-4 rounded h-100 position-relative"
              style={{
                backgroundImage: `url(${Mohsin})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded"
                style={{ backgroundColor: "rgba(158, 234, 255, 0.85)" }}
              ></div>

              <div className="position-relative">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-person-circle fs-2 me-2"></i>
                  <div>
                    <h6 className="mb-0">Mohsin Ahmed</h6>
                    <small className="text-muted">Web Developer</small>
                  </div>
                </div>
                <p className="mb-0">
                  “The courses here are incredibly well-structured. In just 6
                  months, I transformed from a beginner with no experience to
                  securing my dream job, all because the lessons were easy to
                  follow, hands-on, and perfectly paced.”
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-lg-4 col-md-6">
            <div
              className="p-4 rounded h-100 position-relative"
              style={{
                backgroundImage: `url(${seller1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded"
                style={{ backgroundColor: "rgba(53, 222, 129, 0.85)" }}
              ></div>

              <div className="position-relative">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-person-circle fs-2 me-2"></i>
                  <div>
                    <h6 className="mb-0">Abdullah</h6>
                    <small className="text-muted">UI/UX Designer</small>
                  </div>
                </div>
                <p className="mb-0">
                  “I’ve found amazing clients through the service marketplace.
                  The platform makes it effortless to display my work and get
                  noticed by the right people.”
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-lg-4 col-md-6">
            <div
              className="p-4 rounded h-100 position-relative"
              style={{
                backgroundImage: `url(${Bashir})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded"
                style={{ backgroundColor: "rgba(235, 244, 117, 0.85)" }}
              ></div>

              <div className="position-relative">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-person-circle fs-2 me-2"></i>
                  <div>
                    <h6 className="mb-0">Bashir Ullah</h6>
                    <small className="text-muted">Data Scientist</small>
                  </div>
                </div>
                <p className="mb-0">
                  “The collaborative projects helped me build real portfolio
                  pieces. It’s more than just learning – it’s hands-on
                  experience.”
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= JOBS ================= */}
        <div className="text-center my-5">
          <h2 className="fw-bold">Find your dream job !</h2>
          <p className="text-muted">
            We value flat hierarchies, clear communication, and full ownership
          </p>
        </div>

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
                {/* TOP IMAGE SECTION */}
                <div
                  className="position-relative flex-grow-1"
                  style={{
                    backgroundImage: `url(${
                      job.image ? `${API_URL}${job.image}` : card2
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "180px",
                  }}
                >
                  <h3 className="fw-semibold text-white mb-0 position-absolute top-0 start-0 m-2">
                    {job.title}
                  </h3>

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

                    <small className="text-white fw-bold">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-3">
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
                      {job.experience}
                    </span>

                    <span className="border border-1 rounded p-1 text-center">
                      <i className="bi bi-house-door me-2"></i>
                      {job.company}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
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
      </div>{" "}
      <div className="d-flex justify-content-center p-3 mb-3">
        <Link
          to="/jobs"
          className="text-white border-0 text-decoration-none "
          style={{
            backgroundColor: "#064e3b",
            padding: "14px 100px",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          View More <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </>
  );
};
export default Hero;
