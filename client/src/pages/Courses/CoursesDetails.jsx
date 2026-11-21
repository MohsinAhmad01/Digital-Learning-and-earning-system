import React from "react";
import Navbar from "../../components/Navbar";
import Coursedetailmain from "../../assets/coursedetailmain.png";
import courseImage from "../../assets/courseImage.png";
import Footer from "../../layout/Footer";
import Mohsin from "../../assets/mohsin.png";
import Abdullah from "../../assets/seller1.png";
import Bashir from "../../assets/bashir.png";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { Context } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function CoursesDetails() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // course ID from URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  // Review state
  const { isAuthenticated, user } = useContext(Context);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/progress/course/${id}`,
          { withCredentials: true },
        );

        if (res.data.success) {
          setVideos(res.data.videos);
        }
      } catch (err) {
        toast.error("Failed to load course videos");
      } finally {
        setLoadingVideo(false);
      }
    };

    fetchVideos();
  }, [id]);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/courses/${id}`,
        );
        if (res.data.success) {
          setCourse(res.data.course);
          const reviewed = res.data.course.reviews.find(
            (r) => r.user._id === user?._id,
          );
          setHasReviewed(!!reviewed);
        } else {
          setCourse(null);
        }
      } catch (err) {
        toast.error("Failed to fetch course");
        setCourse(null);
      } finally {
        setLoading(false); // ✅ Stop loading here
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment)
      return toast.error("Please provide rating and comment");

    try {
      setSubmitting(true);
      await axios.post(
        `${API_URL}/api/v1/courses/${id}/review`,
        { rating, comment },
        { withCredentials: true }, // send cookie for authentication
      );
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      setHasReviewed(true); // disable form
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (videoId) => {
    try {
      // Optimistically update UI
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, completed: true } : video,
        ),
      );

      // Call backend
      const res = await axios.post(
        `${API_URL}/api/v1/progress/mark-completed`,
        { courseId: id, videoId },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Video marked as completed!");
      }
    } catch (err) {
      // Revert UI if error
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, completed: false } : video,
        ),
      );
      toast.error("Failed to mark video completed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </>
    );
  }
  if (!course) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <h3>Course not found</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div>
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
            {/* TITLE — FIRST ON MOBILE ONLY */}
            <div className="col-12 d-lg-none text-center mb-3 order-1">
              <h3 className="fw-bold display-6">
                Create High-Fidelity Designs and Prototypes in Figma
              </h3>
            </div>

            {/* IMAGE — SECOND ON MOBILE */}
            <div className="col-lg-4 text-center mt-4 mt-lg-0 order-2 order-lg-2">
              <img
                src={Coursedetailmain}
                alt="Course"
                className="img-fluid"
                style={{ maxHeight: "800px", objectFit: "contain" }}
              />
            </div>

            {/* TEXT CONTENT — THIRD ON MOBILE / LEFT ON DESKTOP */}
            <div className="col-lg-8 px-lg-5 pt-2 text-center text-lg-start order-3 order-lg-1">
              {/* TITLE — DESKTOP ONLY */}
              <h3 className="fw-bold display-5 d-none d-lg-block">
                Master {course.Catagory} and Unlock Your Earning Potential
              </h3>

              <p className="fs-5" style={{ maxWidth: "600px" }}>
                This comprehensive {course.Catagory} course is designed to equip
                you with the essential skills needed to excel in real-world
                projects. You will gain hands-on experience with{" "}
                {course.skillsYouWillGain?.length > 0
                  ? course.skillsYouWillGain.join(", ")
                  : "industry-relevant skills"}
                , enhancing your portfolio and preparing you for professional
                opportunities. Whether you are starting out or looking to
                upskill, this course empowers you to achieve your goals in{" "}
                {course.Catagory}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="row g-4">
          {/* LEFT SIDE */}
          <div className="col-lg-8">
            {/* Image */}
            <div className="card mb-4">
              <img
                src={course.image}
                alt={course.title}
                className="img-fluid w-100"
                style={{
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "10px",
                }}
              />
            </div>

            <div className="col-lg-8 text-center text-lg-start">
              <h1 className="fw-bold ">{course.title}</h1>
              <p className="fs-5">{course.description}</p>
              <p>
                <strong>Category:</strong> {course.Catagory} |{" "}
                <strong>Prize:</strong> {course.prize} |{" "}
                <strong>Duration:</strong> {course.duration || "N/A"} |{" "}
                <strong>Level:</strong> {course.level || "N/A"}
              </p>
            </div>
            {/* Course Info */}
            <div className="mb-4">
              <h4 className="fw-bold">Course Info</h4>
              <p className="text-muted">{course.description}</p>
            </div>

            {/* Course Content (FAQ / Accordion) */}
            <div className="mb-5">
              <h4 className="fw-bold mb-4">Course Content</h4>

              <div className="accordion" id="courseContent">
                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button fw-semibold rounded-top-3 d-flex align-items-center"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#section1"
                    >
                      <i className="bi bi-layers me-2 text-success fs-5"></i>
                      {course.title} Course
                      <span className="ms-auto badge bg-success-subtle text-success">
                        {videos.length} Lessons
                      </span>
                    </button>
                  </h2>

                  <div
                    id="section1"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#courseContent"
                  >
                    <div className="accordion-body p-0">
                      <ul className="list-group list-group-flush">
                        {videos.length > 0 ? (
                          videos.map((video) => (
                            <li
                              key={video._id}
                              className="list-group-item d-flex justify-content-between align-items-center py-3"
                            >
                              <Link
                                to={`/courses/${course._id}/video/${video._id}`}
                                className={
                                  video.completed
                                    ? "text-decoration-line-through text-muted"
                                    : ""
                                }
                              >
                                {video.title}
                              </Link>

                              {!video.completed && (
                                <button
                                  className="btn btn-sm btn-success"
                                  disabled
                                >
                                  Mark Completed
                                </button>
                              )}

                              {video.completed && (
                                <span className="badge bg-success">
                                  Completed
                                </span>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item text-muted py-3">
                            No videos available
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">What You'll Learn</h5>
                <ul className="list-unstyled">
                  <li className="mb-4">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Build mockups and high-fidelity prototypes in the design
                    tool Figma.
                  </li>
                  <li className="mb-4">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Define and apply common visual design elements and
                    principles.
                  </li>
                  <li className="mb-4">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Apply color theory, typography, layout, and design complete
                    mobile and web apps.
                  </li>
                  <li className="mb-4">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Demonstrate how design systems can be used to organize,
                    standardize, and enhance designs.
                  </li>
                </ul>

                <hr />

                <h5 className="fw-bold mb-3">Outcomes</h5>
                <ul className="list-unstyled mb-5">
                  <li className="mb-3">
                    <i className="bi bi-award  me-2"></i>
                    Gain a foundational understanding of tools
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-briefcase me-2"></i>
                    Develop job-relevant skills
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-briefcase me-2"></i>
                    Earn a shareable career certificate
                  </li>
                </ul>

                <hr />

                <h5 className="fw-bold mb-3">Flexible Schedule</h5>
                <p className="text-muted mb-4 ">Duration: {course.duration}</p>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Tags</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {course.tags?.map((tag, i) => (
                      <span key={i} className="badge bg-light border text-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <hr />
                <div className="mb-4">
                  <h5 className="fw-bold">Skills You'll Gain</h5>
                  <ul className="list-unstyled">
                    {course.skillsYouWillGain?.map((skill, i) => (
                      <li key={i}>
                        <i className="bi bi-dot me-2"></i> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container my-5">
        <h3 className="fw-bold mb-3">Student Reviews</h3>
        {course.reviews.length > 0 ? (
          <div className="mb-4">
            {course.reviews.map((review, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        review.user?.avatar?.url ||
                        review.user?.avatar ||
                        "https://i.pravatar.cc/100?img=12"
                      }
                      alt={review.user?.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #198754",
                      }}
                    />

                    <strong>{review.user?.name || "Anonymous"} :</strong>
                  </div>
                  <span> {review.rating} / 5 ⭐</span>
                </div>
                <p className="mb-2 ms-4">
                  <b>Comment: </b> {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this course!</p>
        )}

        {/* Add Review Form */}
        <div className="border rounded p-4">
          <h5 className="fw-bold mb-3">Add Your Review</h5>
          <form onSubmit={handleSubmitReview}>
            {/* Star Rating */}
            <div className="mb-3">
              <label className="form-label d-block">Give Rating</label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      fontSize: "2.5rem",
                      cursor: "pointer",
                      color:
                        star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9",
                    }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <small className="text-muted">{rating} / 5</small>
            </div>

            {/* Comment */}
            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "#eaf2f1" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            {/* IMAGE SIDE */}
            <div className="col-lg-6 text-center">
              <img
                src={course.image}
                alt="Learner Outcomes"
                className="img-fluid rounded-4 shadow"
              />
            </div>

            {/* TEXT SIDE */}
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3">
                Learner Outcomes On{" "}
                <span className="text-success">DevTech</span>
              </h2>

              <p className=" mb-4">
                <strong>83%</strong> of people learning for professional
                development <br /> report career benefits like getting a
                promotion, <br /> a raise, or starting a new career.
              </p>

              <p className="small text-muted fst-italic mb-4">
                — DevTech learner outcomes survey (2025)
              </p>

              <button className="btn btn-success px-4 py-2">
                Join For Free
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center m-5 ">
        <h3>Why people choose DevTech for their career</h3>
      </div>
      <div className="container align-items-center justify-content-center row g-4  m-1 mb-5 ">
        {/* Card 1 */}
        <div className="col-lg-4 col-md-6">
          <div className="p-4 rounded h-100 bg-light ">
            <div className="d-flex align-items-center mb-3">
              <img
                src={Mohsin}
                height={"50px"}
                width={"50px"}
                style={{ borderRadius: "35%" }}
                className="ms-1 me-2"
                alt="Mohsin Ahmed picture"
              />
              <div>
                <h6 className="mb-0 fw-bold">Mohsin Ahmed</h6>
                <small className="text-muted">Dev-Tech Founder</small>
              </div>
            </div>
            <p className="mb-0">
              “I directly applied the concepts and skills I learned from my
              courses to an exciting new project at work, enabling me to add
              real value to the team, enhance project outcomes, and demonstrate
              how continuous learning can drive meaningful results.”
            </p>
          </div>
        </div>{" "}
        {/* Card 2 */}
        <div className="col-lg-4 col-md-6">
          <div className="p-4 rounded h-100 bg-light ">
            <div className="d-flex align-items-center mb-3">
              <img
                src={Abdullah}
                height={"50px"}
                width={"50px"}
                style={{ borderRadius: "35%" }}
                className="ms-1 me-2"
                alt="Abdullah picture"
              />
              <div>
                <h6 className="mb-0 fw-bold">Abdullah</h6>
                <small className="text-muted">Dev-Tech Co-Founder</small>
              </div>
            </div>
            <p className="mb-0">
              “Having the freedom to take courses at my own pace and rhythm has
              been an incredible experience. It allows me to learn whenever it
              suits my schedule and mood, giving me the flexibility to absorb
              concepts more deeply and maintain a healthy balance between work
              and study.”
            </p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="col-lg-4 col-md-6">
          <div className="p-4 rounded h-100 bg-light ">
            <div className="d-flex align-items-center mb-3">
              <img
                src={Bashir}
                height={"50px"}
                width={"50px"}
                style={{ borderRadius: "35%" }}
                className="ms-1 me-2"
                alt="Bashir Ullah picture"
              />
              <div>
                <h6 className="mb-0 fw-bold">Bashir Ullah</h6>
                <small className="text-muted">Dev-Tech CEO</small>
              </div>
            </div>
            <p className="mb-0">
              “When I need courses on topics that my university doesn’t offer,
              DevTech is one of the best places to go. It provides high-quality
              learning resources that help me fill knowledge gaps and explore
              new areas of interest..”
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoursesDetails;
