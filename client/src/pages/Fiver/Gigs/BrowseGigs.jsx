import React, { useEffect, useMemo, useState } from "react";
import FreelanceNavbar from "../FreelanceNavbar.jsx";
import Footer from "../../../layout/Footer.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../../styles/BrowseGigs.css";
import { useSearchParams } from "react-router-dom";
function BrowseGigs() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [searchParams] = useSearchParams();

const selectedCategory = searchParams.get("category");

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    const cleanPath = image.replace(/\\/g, "/").replace(/^\/+/, "");

    return `${API_URL}/${cleanPath}`;
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
    fetchGigs();
  }, []);

  const filteredGigs = useMemo(() => {
    let result = [...gigs];
if (selectedCategory) {
    result = result.filter(
      (gig) => gig.category === selectedCategory
    );
  }
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((gig) => {
        return (
          gig.title?.toLowerCase().includes(searchValue) ||
          gig.packages?.basic?.title?.toLowerCase().includes(searchValue) ||
          gig.category?.toLowerCase().includes(searchValue) ||
          gig.description?.toLowerCase().includes(searchValue)
        );
      });
    }

    if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "Price Low to High") {
      result.sort(
        (a, b) =>
          Number(a.packages?.basic?.price || 0) -
          Number(b.packages?.basic?.price || 0),
      );
    }

    if (sortBy === "Price High to Low") {
      result.sort(
        (a, b) =>
          Number(b.packages?.basic?.price || 0) -
          Number(a.packages?.basic?.price || 0),
      );
    }

    if (sortBy === "Top Rated") {
      result.sort((a, b) => {
        const ratingA = a.starNumber ? a.totalStars / a.starNumber : 0;
        const ratingB = b.starNumber ? b.totalStars / b.starNumber : 0;
        return ratingB - ratingA;
      });
    }

    return result;
  }, [gigs, search, sortBy]);

  return (
    <>
      <FreelanceNavbar />

      <div className="browse-gigs-page">
        <div className="container py-5">
          <div className="browse-gigs-header mb-5">
            <div className="row align-items-center g-3">
              <div className="col-12 col-lg-3">
                <h2 className="fw-bold mb-1">Browse Gigs</h2>
                <p className="mb-0 text-muted small">
                  Find the perfect service for your business
                </p>
              </div>

              <div className="col-12 col-md-7 col-lg-6">
                <div className="input-group shadow-sm rounded-3 overflow-hidden">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0 shadow-none py-2"
                    placeholder="Search gigs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button
                    className="btn text-white px-4 fw-semibold"
                    type="button"
                    style={{ backgroundColor: "#005450" }}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-5 col-lg-3">
                <div className="d-flex align-items-center justify-content-md-end gap-2">
                  <span className="text-dark fw-semibold text-nowrap">
                    Sort by:
                  </span>

                  <select
                    className="form-select shadow-none py-3"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Recommended</option>
                    <option>Newest</option>
                    <option>Top Rated</option>
                    <option>Price Low to High</option>
                    <option>Price High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3 mb-0 text-muted">Loading gigs...</p>
            </div>
          )}

          {error && !loading && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {!loading && !error && filteredGigs.length === 0 && (
            <div className="text-center py-5">
              <h5 className="fw-bold">No gigs found</h5>
              <p className="text-muted mb-0">
                Try changing your search or create a new gig.
              </p>
            </div>
          )}

          {!loading && !error && filteredGigs.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {filteredGigs.map((gig) => {
                const rating = gig.starNumber
                  ? (gig.totalStars / gig.starNumber).toFixed(1)
                  : "0.0";

                const basicPackage = gig.packages?.basic;

                const startingPrice = basicPackage?.price || 0;
                const deliveryTime = basicPackage?.deliveryTime || 0;

                const coverImage =
                  gig.cover ||
                  (Array.isArray(gig.images) && gig.images.length > 0
                    ? gig.images[0]
                    : "");

                const finalCoverImage = getImageUrl(coverImage);

                const sellerName = gig.owner?.name || "Seller";

                const sellerAvatar =
                  gig.owner?.avatar?.url ||
                  "https://randomuser.me/api/portraits/men/32.jpg";

                return (
                  <div className="col" key={gig._id}>
                    <Link
                      to={`/gigs/${gig._id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="card gig-card h-100 border-0 shadow rounded-4 overflow-hidden">
                        <div className="gig-card-image-box">
                          {finalCoverImage ? (
                            <img
                              src={finalCoverImage}
                              alt={gig.title}
                              className="gig-card-image"
                              loading="lazy"
                            />
                          ) : (
                            <div className="gig-card-image-placeholder"></div>
                          )}

                          <button
                            className="btn btn-light btn-sm gig-heart-btn"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <i className="bi bi-heart"></i>
                          </button>
                        </div>

                        <div className="card-body p-3">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <img
                              src={sellerAvatar}
                              alt={sellerName}
                              className="rounded-circle"
                              style={{
                                width: "36px",
                                height: "36px",
                                objectFit: "cover",
                              }}
                            />

                            <div className="seller-info-text">
                              <h6 className="mb-0 fw-bold small">
                                <button
                                  type="button"
                                  className="btn p-0 border-0 bg-transparent fw-bold small text-dark"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.location.href = `/freelancers/${gig.owner?._id}`;
                                  }}
                                >
                                  {sellerName}
                                </button>

                                <span className="ms-1 badge rounded-circle bg-success p-1">
                                  ✓
                                </span>
                              </h6>
                              <p className="mb-0 text-muted small">
                                Level 1 Seller
                              </p>
                            </div>
                          </div>

                          <h6 className="fw-bold mb-3 lh-base gig-card-title">
                            {gig.title}
                          </h6>

                          <div className="d-flex align-items-center gap-2 small text-muted flex-wrap">
                            <span className="text-warning">★</span>
                            <strong className="text-dark">{rating}</strong>
                            <span>({gig.starNumber || 0})</span>
                            <span>|</span>
                            <span>{deliveryTime} Days Delivery</span>
                          </div>
                        </div>

                        <div className="card-footer bg-white border-top d-flex justify-content-end align-items-center gap-2 py-3">
                          <span className="text-muted">From</span>
                          <strong className="fs-5" style={{ color: "#00635d" }}>
                            ${startingPrice}
                          </strong>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BrowseGigs;
