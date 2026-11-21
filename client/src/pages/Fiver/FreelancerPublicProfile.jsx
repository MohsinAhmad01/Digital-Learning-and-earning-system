import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import FreelanceNavbar from "./FreelanceNavbar.jsx";
import Footer from "../../layout/Footer.jsx";
import "../../styles/FreelancerPublicProfile.css";
import { useNavigate } from "react-router-dom";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) return image;

  const cleanPath = image.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${API_URL}/${cleanPath}`;
};

function FreelancerPublicProfile() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [freelancer, setFreelancer] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [profileStats, setProfileStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    completedOrders: 0,
  });
  const handleContactMe = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/messages/conversation/start`,
        {
          receiverId: freelancer._id,
        },
        {
          withCredentials: true,
        },
      );

      navigate(`/messages/${data.conversation._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start conversation.");
    }
  };
  const fetchFreelancerProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        `${API_URL}/api/v1/user/freelancer/${id}`,
        {
          withCredentials: true,
        },
      );

      setFreelancer(data.freelancer);
      setGigs(data.gigs || []);
      setReviews(data.reviews || []);
      setProfileStats({
        averageRating: data.stats?.averageRating || 0,
        totalReviews: data.stats?.totalReviews || 0,
        completedOrders: data.stats?.completedOrders || 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch freelancer profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerProfile();
  }, [id]);

  const stats = useMemo(() => {
    return {
      rating: profileStats.averageRating || 0,
      orders: profileStats.completedOrders || freelancer?.totalOrders || 0,
      sales: freelancer?.totalSales || 0,
      reviews: profileStats.totalReviews || 0,
    };
  }, [freelancer, profileStats]);
  if (loading) {
    return (
      <>
        <FreelanceNavbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-success"></div>
          <p className="text-muted mt-3">Loading freelancer profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <FreelanceNavbar />
        <div className="container py-5">
          <div className="alert alert-danger text-center">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!freelancer) return null;

  const avatar =
    freelancer.avatar?.url || "https://randomuser.me/api/portraits/men/32.jpg";

  const memberSince = freelancer.createdAt
    ? new Date(freelancer.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const skills =
    Array.isArray(freelancer.skills) && freelancer.skills.length > 0
      ? freelancer.skills
      : ["Web Development", "Responsive Design", "Professional Support"];

  return (
    <>
      <FreelanceNavbar />

      <div className="freelancer-profile-page py-4">
        <div className="container">
          {/* BREADCRUMB */}
          <div className="d-flex align-items-center gap-2 small mb-3">
            <Link to="/" className="text-success text-decoration-none">
              Home
            </Link>
            <i className="bi bi-chevron-right small text-muted"></i>
            <Link to="/gigs" className="text-success text-decoration-none">
              Freelancers
            </Link>
            <i className="bi bi-chevron-right small text-muted"></i>
            <span className="text-muted">{freelancer.name}</span>
          </div>

          {/* HERO */}
          <div className="freelancer-profile-hero rounded-4 mb-4">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <div className="profile-avatar-box">
                    <img src={avatar} alt={freelancer.name} />
                    <span className="profile-online-dot"></span>
                  </div>

                  <div>
                    <h2 className="fw-bold text-white mb-1">
                      {freelancer.name}
                      <span className="ms-2 text-success">
                        <i className="bi bi-patch-check-fill"></i>
                      </span>
                    </h2>

                    <p className="text-white-50 mb-2 text-capitalize">
                      {freelancer.role === "freelancer"
                        ? "Freelancer"
                        : freelancer.role}
                    </p>

                    <div className="d-flex align-items-center gap-3 flex-wrap text-white small">
                      <span>
                        <i className="bi bi-geo-alt me-1"></i>
                        Pakistan
                      </span>

                      <span>•</span>

                      <span>Member since {memberSince}</span>
                    </div>

                    <div className="d-flex align-items-center gap-3 flex-wrap mt-2 text-white small">
                      <span>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {stats.rating} Rating
                      </span>

                      <span>|</span>

                      <span>{stats.orders} Orders Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="profile-stats-box ms-lg-auto">
                  <div>
                    <h4>{stats.orders}</h4>
                    <p>Orders Completed</p>
                  </div>

                  <div>
                    <h4>{stats.reviews}</h4>
                    <p>Reviews</p>
                  </div>

                  <div>
                    <h4>{stats.rating ? "100%" : "0%"}</h4>
                    <p>On-Time Delivery</p>
                  </div>

                  <div>
                    <h4>{memberSince}</h4>
                    <p>On DevTech</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="profile-tabs mb-4">
            <button
              className={activeTab === "about" ? "active" : ""}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>

            <button
              className={activeTab === "services" ? "active" : ""}
              onClick={() => setActiveTab("services")}
            >
              Services ({gigs.length})
            </button>

            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({stats.reviews})
            </button>
          </div>

          <div className="row g-4">
            {/* LEFT */}
            <div className="col-lg-8">
              {activeTab === "about" && (
                <>
                  {/* ABOUT */}
                  <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3">About Me</h5>

                      <p className="text-muted lh-lg mb-4">
                        {freelancer.bio ||
                          "This freelancer has not added a bio yet."}
                      </p>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="profile-feature">
                            <i className="bi bi-check-circle text-success"></i>
                            Responsive Design
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="profile-feature">
                            <i className="bi bi-check-circle text-success"></i>
                            Clean & Modern Code
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="profile-feature">
                            <i className="bi bi-check-circle text-success"></i>
                            24/7 Support
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="profile-feature">
                            <i className="bi bi-check-circle text-success"></i>
                            On-Time Delivery
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SKILLS */}
                  <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3">Skills</h5>

                      <div className="d-flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span className="profile-skill-chip" key={index}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SERVICES PREVIEW */}
                  <ServicesSection gigs={gigs.slice(0, 4)} />
                </>
              )}

              {activeTab === "services" && <ServicesSection gigs={gigs} />}

              {activeTab === "reviews" && <ReviewsSection reviews={reviews} />}
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">About Me</h5>
                  <ProfileInfo
                    label="From"
                    value={freelancer.country || "Not provided"}
                  />
                  <ProfileInfo
                    label="Language"
                    value={
                      Array.isArray(freelancer.languages) &&
                      freelancer.languages.length > 0
                        ? freelancer.languages.join(", ")
                        : "Not provided"
                    }
                  />
                  <ProfileInfo label="Member Since" value={memberSince} />
                  <ProfileInfo label="Avg. Response Time" value="1 Hour" />
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Availability</h5>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="availability-dot"></span>
                    <span className="fw-semibold text-success">Available</span>
                  </div>

                  <p className="text-muted small">
                    I am available for new projects.
                  </p>

                  <button
                    type="button"
                    onClick={handleContactMe}
                    className="btn text-white w-100 fw-semibold"
                    style={{ backgroundColor: "#005450" }}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Contact Me
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function ProfileInfo({ label, value }) {
  return (
    <div className="d-flex align-items-center justify-content-between border-bottom py-3">
      <span className="text-muted small">{label}</span>
      <span className="fw-semibold small">{value}</span>
    </div>
  );
}
function ServicesSection({ gigs }) {
  const getGigImage = (gig) => {
    const image =
      gig.cover ||
      (Array.isArray(gig.images) && gig.images.length > 0 ? gig.images[0] : "");

    return getImageUrl(image);
  };

  if (!gigs || gigs.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center py-5">
          <h6 className="fw-bold">No services yet</h6>
          <p className="text-muted small mb-0">
            This freelancer has not published any gigs yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3">My Services</h5>

        <div className="row g-3">
          {gigs.map((gig) => {
            const basic = gig.packages?.basic;
            const price = basic?.price || 0;

            return (
              <div className="col-md-6 col-lg-4" key={gig._id}>
                <Link
                  to={`/gigs/${gig._id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="profile-service-card">
                    {getGigImage(gig) ? (
                      <img src={getGigImage(gig)} alt={gig.title} />
                    ) : (
                      <div className="profile-service-placeholder"></div>
                    )}

                    <div className="p-2">
                      <h6>{gig.title}</h6>
                      <p>{gig.category}</p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="small text-warning">
                            <i className="bi bi-star-fill"></i>{" "}
                            {gig.starNumber
                              ? (gig.totalStars / gig.starNumber).toFixed(1)
                              : "0.0"}
                          </span>

                          <span className="small text-muted ms-1">
                            ({gig.starNumber || 0})
                          </span>
                        </div>

                        <strong>${price}</strong>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* PASTE THIS FUNCTION HERE */
function ReviewsSection({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Reviews</h5>

          <div className="text-center py-4">
            <i className="bi bi-star fs-1 text-muted"></i>
            <h6 className="fw-bold mt-3">No reviews yet</h6>
            <p className="text-muted small mb-0">
              Reviews will appear here after completed orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Reviews ({reviews.length})</h5>

        <div className="d-flex flex-column gap-4">
          {reviews.map((review) => {
            const reviewerName = review.reviewer?.name || "Buyer";

            const reviewerAvatar =
              review.reviewer?.avatar?.url ||
              "https://randomuser.me/api/portraits/men/45.jpg";

            const reviewDate = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            return (
              <div className="profile-review-card" key={review._id}>
                <div className="d-flex align-items-start gap-3">
                  <img
                    src={reviewerAvatar}
                    alt={reviewerName}
                    className="rounded-circle"
                    style={{
                      width: "46px",
                      height: "46px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
                      <div>
                        <h6 className="fw-bold mb-0">{reviewerName}</h6>
                        <small className="text-muted">
                          For Gig: {review.gigId?.title || "Gig Review"}
                        </small>
                      </div>

                      <small className="text-muted">{reviewDate}</small>
                    </div>

                    <div className="mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi ${
                            star <= review.rating
                              ? "bi-star-fill text-warning"
                              : "bi-star text-muted"
                          } me-1`}
                        ></i>
                      ))}

                      <span className="fw-semibold ms-1">
                        {Number(review.rating).toFixed(1)}
                      </span>
                    </div>

                    <p className="text-muted mb-0">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FreelancerPublicProfile;
