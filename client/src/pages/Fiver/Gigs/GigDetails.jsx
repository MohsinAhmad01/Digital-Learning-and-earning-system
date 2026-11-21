import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FreelanceNavbar from "../FreelanceNavbar.jsx";
import Footer from "../../../layout/Footer.jsx";
import "../../../styles/GigDetails.css";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) return image;

  const cleanPath = image.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${API_URL}/${cleanPath}`;
};

function GigDetails() {
const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [activePackage, setActivePackage] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchGig = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        `${API_URL}/api/v1/gigs/${id}`,
        {
          withCredentials: true,
        },
      );

      const singleGig = data.gig || data;
      setGig(singleGig);

      const firstImage =
        singleGig.cover ||
        (Array.isArray(singleGig.images) && singleGig.images.length > 0
          ? singleGig.images[0]
          : "");

      setActiveImage(getImageUrl(firstImage));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch gig details.");
    } finally {
      setLoading(false);
    }
  };
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const { data } = await axios.get(`${API_URL}/api/v1/reviews/${id}`, {
        withCredentials: true,
      });

      setReviews(data.reviews || []);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch reviews.");
    } finally {
      setReviewsLoading(false);
    }
  };
  useEffect(() => {
    fetchGig();
    fetchReviews();
  }, [id]);
  const rating = useMemo(() => {
    if (!gig?.starNumber) return "0.0";
    return (gig.totalStars / gig.starNumber).toFixed(1);
  }, [gig]);

  const galleryImages = useMemo(() => {
    if (!gig) return [];

    const images = [];

    const addImage = (img) => {
      const finalUrl = getImageUrl(img);

      if (finalUrl && !images.includes(finalUrl)) {
        images.push(finalUrl);
      }
    };

    addImage(gig.cover);

    if (Array.isArray(gig.images)) {
      gig.images.forEach((img) => addImage(img));
    }

    return images;
  }, [gig]);

  const handlePrevImage = () => {
    if (!galleryImages.length) return;

    const currentIndex = galleryImages.findIndex((img) => img === activeImage);

    const prevIndex =
      currentIndex <= 0 ? galleryImages.length - 1 : currentIndex - 1;

    setActiveImage(galleryImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (!galleryImages.length) return;

    const currentIndex = galleryImages.findIndex((img) => img === activeImage);

    const nextIndex =
      currentIndex === -1 || currentIndex === galleryImages.length - 1
        ? 0
        : currentIndex + 1;

    setActiveImage(galleryImages[nextIndex]);
  };

  if (loading) {
    return (
      <>
        <FreelanceNavbar />

        <div className="container py-5 text-center">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3 text-muted">Loading gig details...</p>
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

  if (!gig) return null;

  const seller = gig.owner || {};
  const handleContactSeller = async () => {
    try {
      if (!seller?._id || !gig?._id) {
        alert("Seller information is missing.");
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/api/v1/messages/conversation/start`,
        {
          receiverId: seller._id,
          gigId: gig._id,
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
  const handleContinueOrder = () => {
    navigate(`/create-order/${gig._id}?package=${activePackage}`);
  };
  const sellerName = seller.name || "Seller";

  const sellerAvatar =
    seller.avatar?.url || "https://randomuser.me/api/portraits/men/32.jpg";

  const sellerRole =
    seller.role === "freelancer" ? "Freelancer" : seller.role || "Seller";

  const sellerBio = seller.bio || "This seller has not added a bio yet.";

  const sellerRating = seller.rating || rating;

  const sellerOrders = seller.totalOrders || gig.sales || 0;

  const sellerSkills =
    Array.isArray(seller.skills) && seller.skills.length > 0
      ? seller.skills
      : ["Web Development", "Responsive Design", "Professional Support"];

  const memberSince = seller.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const selectedPackage = gig.packages?.[activePackage] || gig.packages?.basic;

  const selectedPackagePrice = selectedPackage?.price || 0;

  const selectedPackageDescription =
    selectedPackage?.description || "No package description available.";

  const selectedPackageDelivery = selectedPackage?.deliveryTime || 0;

  const selectedPackageFeatures =
    selectedPackage?.features && selectedPackage.features.length > 0
      ? selectedPackage.features
      : ["Responsive Design", "Fast Delivery", "Professional Support"];

  return (
    <>
      <FreelanceNavbar />

      <div className="container py-4 gig-detail-page">
        <div className="row g-5">
          {/* LEFT SIDE */}
          <div className="col-lg-8">
            {/* BREADCRUMB */}
            <div className="d-flex align-items-center gap-2 small mb-3 text-muted">
              <Link
                to="/gigs"
                className="text-success fw-semibold text-decoration-none"
              >
                Home
              </Link>

              <i className="bi bi-chevron-right small"></i>

              <span className="text-success fw-semibold">{gig.category}</span>

              <i className="bi bi-chevron-right small"></i>

              <span>{selectedPackage?.title || gig.title}</span>
            </div>

            {/* TITLE */}
            <h1 className="fw-bold mb-3 gig-detail-title">{gig.title}</h1>

            {/* SELLER ROW */}
            <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="rounded-circle"
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "cover",
                }}
              />

              <div>
                <h6 className="mb-0 fw-bold">
                  <Link
                    to={`/freelancers/${seller._id}`}
                    className="text-dark text-decoration-none"
                  >
                    {sellerName}
                  </Link>
                </h6>

                <p className="mb-0 small text-muted">{sellerRole}</p>
              </div>

              <span className="text-muted">|</span>

              <div className="small">
                <span className="text-warning">★</span>
                <strong className="ms-1">{rating}</strong>
                <span className="text-muted ms-1">
                  ({gig.starNumber || 0} reviews)
                </span>
              </div>

              <span className="text-muted">|</span>

              <div className="small text-muted">
                {gig.sales || 0} Orders in Queue
              </div>
            </div>

            {/* MAIN IMAGE FIXED 500x500 */}
            <div className="gig-main-image-wrapper mb-3">
              <div className="gig-main-image-box-fixed">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={gig.title}
                    className="gig-main-fixed-img"
                  />
                ) : (
                  <div className="gig-image-placeholder">
                    <span>No Image Available</span>
                  </div>
                )}

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="gig-detail-slider-btn left"
                      onClick={handlePrevImage}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    <button
                      type="button"
                      className="gig-detail-slider-btn right"
                      onClick={handleNextImage}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}
            <div className="gig-thumbnails d-flex gap-3 mb-4 overflow-auto pb-2">
              {galleryImages.length > 0
                ? galleryImages.map((img, index) => (
                    <button
                      key={index}
                      className={`gig-detail-thumb-btn ${
                        activeImage === img ? "active" : ""
                      }`}
                      onClick={() => setActiveImage(img)}
                      type="button"
                    >
                      <img src={img} alt={`thumb-${index}`} />
                    </button>
                  ))
                : [1, 2, 3, 4, 5].map((item) => (
                    <div className="gig-thumb-placeholder" key={item}></div>
                  ))}
            </div>

            {/* ABOUT */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">About This Gig</h5>

              <p className="text-muted lh-lg">{gig.description}</p>

              <div className="row g-3 mt-3">
                {selectedPackageFeatures.map((feature, index) => (
                  <div className="col-md-4 col-sm-6" key={index}>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="bi bi-check-circle text-success"></i>
                      <span>{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-5">
              <h5 className="fw-bold mb-3">Frequently Asked Questions</h5>

              {gig.faqs && gig.faqs.length > 0 ? (
                <div className="accordion" id="gigFaq">
                  {gig.faqs.map((faq, index) => (
                    <div className="accordion-item" key={index}>
                      <h2
                        className="accordion-header"
                        id={`faqHeading${index}`}
                      >
                        <button
                          className="accordion-button collapsed fw-semibold"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faqCollapse${index}`}
                          aria-expanded="false"
                          aria-controls={`faqCollapse${index}`}
                        >
                          {faq.question}
                        </button>
                      </h2>

                      <div
                        id={`faqCollapse${index}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`faqHeading${index}`}
                        data-bs-parent="#gigFaq"
                      >
                        <div className="accordion-body text-muted">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card border-0 bg-light rounded-3">
                  <div className="card-body">
                    <p className="text-muted mb-0 small">
                      No frequently asked questions added for this gig.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">
            <div className="gig-sticky-sidebar">
              {/* PACKAGE CARD */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-0">
                  <div className="d-flex border-bottom">
                    {[
                      { key: "basic", label: "Basic" },
                      { key: "standard", label: "Standard" },
                      { key: "premium", label: "Premium" },
                    ].map((pkg) => (
                      <button
                        key={pkg.key}
                        className={`btn flex-fill rounded-0 py-3 fw-semibold package-tab ${
                          activePackage === pkg.key ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => setActivePackage(pkg.key)}
                      >
                        {pkg.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">
                        {selectedPackage?.packageName || "Package"}
                      </h6>

                      <h4 className="fw-bold mb-0" style={{ color: "#00635d" }}>
                        ${selectedPackagePrice}
                      </h4>
                    </div>

                    <p className="text-muted small lh-lg">
                      {selectedPackageDescription}
                    </p>

                    <ul className="list-unstyled small text-muted mt-4">
                      {selectedPackageFeatures.map((feature, index) => (
                        <li className="mb-3" key={index}>
                          <i className="bi bi-check-circle text-success me-2"></i>
                          {feature}
                        </li>
                      ))}

                      <li className="mb-3">
                        <i className="bi bi-arrow-repeat me-2"></i>
                        {selectedPackage?.revisionNumber || 0} Revisions
                      </li>

                      <li className="mb-3">
                        <i className="bi bi-clock me-2"></i>
                        {selectedPackageDelivery} Days Delivery
                      </li>
                    </ul>

                    <button
                      type="button"
                      onClick={handleContinueOrder}
                      className="btn w-100 text-white fw-bold py-3 rounded-3 mb-3"
                      style={{ backgroundColor: "#00635d" }}
                    >
                      Continue (${selectedPackagePrice})
                    </button>

                    <button
                      type="button"
                      onClick={handleContactSeller}
                      className="btn btn-outline-success w-100 fw-bold py-3 rounded-3"
                    >
                      <i className="bi bi-chat-dots me-2"></i>
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>

              {/* SELLER CARD */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <img
                      src={sellerAvatar}
                      alt={sellerName}
                      className="rounded-circle"
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <h6 className="mb-0 fw-bold">
                        <Link
                          to={`/freelancers/${seller._id}`}
                          className="text-dark text-decoration-none"
                        >
                          {sellerName}
                        </Link>
                      </h6>
                      <p className="text-muted small mb-0">{sellerRole}</p>
                    </div>
                  </div>

                  <p className="text-muted small lh-lg mb-4">{sellerBio}</p>

                  <div className="row text-center mb-4">
                    <div className="col">
                      <h5 className="fw-bold mb-0">{sellerRating}</h5>
                      <small className="text-muted">Rating</small>
                    </div>

                    <div className="col border-start">
                      <h5 className="fw-bold mb-0">{sellerOrders}</h5>
                      <small className="text-muted">Orders</small>
                    </div>

                    <div className="col border-start">
                      <h6 className="fw-bold mb-0">{memberSince}</h6>
                      <small className="text-muted">Member</small>
                    </div>
                  </div>

                  <div className="seller-skills-box mb-4">
                    <h6 className="fw-bold mb-3">Skills</h6>

                    <div className="seller-skills-list">
                      {sellerSkills.map((skill, index) => (
                        <span key={index} className="seller-skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/freelancers/${seller._id}`}
                    className="btn btn-outline-success w-100 fw-bold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              {/* PROTECTION BOX */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex gap-3 mb-3">
                    <i className="bi bi-lightning-charge text-success fs-3"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Highly Responsive</h6>
                      <p className="small text-muted mb-0">
                        Usually replies within a few hours
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <i className="bi bi-shield-check text-success fs-3"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Trusted by Buyers</h6>
                      <p className="small text-muted mb-0">
                        All orders are protected by DevTech
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <i className="bi bi-currency-dollar text-success fs-3"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Money Back Guarantee</h6>
                      <p className="small text-muted mb-0">
                        Get your money back if you're not satisfied.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE END */}
          {/* REVIEWS */}
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Reviews :</h5>

              <div className="small">
                <span className="text-warning">★</span>
                <strong className="ms-1">{rating}</strong>
                <span className="text-muted ms-1">
                  ({gig.starNumber || 0} reviews)
                </span>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-success"
                  role="status"
                ></div>
                <p className="text-muted small mt-2 mb-0">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="card border-0 bg-light rounded-3">
                <div className="card-body text-center py-4">
                  <i className="bi bi-star text-muted fs-2"></i>
                  <h6 className="fw-bold mt-3 mb-1">No reviews yet</h6>
                  <p className="text-muted small mb-0">
                    Reviews will appear here after completed orders.
                  </p>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
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
                    <div
                      className="card border-0 shadow-sm rounded-4"
                      key={review._id}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src={reviewerAvatar}
                            alt={reviewerName}
                            className="rounded-circle"
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                            }}
                          />

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                              <div>
                                <h6 className="fw-bold mb-1">{reviewerName}</h6>

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
                              </div>

                              <small className="text-muted">{reviewDate}</small>
                            </div>

                            <p className="text-muted mb-0">
                              {review.comment || "No comment provided."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default GigDetails;
