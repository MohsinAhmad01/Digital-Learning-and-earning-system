import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FreelanceNavbar from "./FreelanceNavbar.jsx";
import Footer from "../../layout/Footer.jsx";
import "../../styles/FreelancerDashboard.css";
import { toast } from "react-toastify";
function FreelancerDashboard() {
  const [freelancer, setFreelancer] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [userRes, gigsRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/user/me`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}/api/v1/gigs/my-gigs`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}/api/v1/orders`, {
          withCredentials: true,
        }),
      ]);

      setFreelancer(userRes.data.user);
      setGigs(gigsRes.data.gigs || []);
      setOrders(ordersRes.data.orders || ordersRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load freelancer dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteGig = async (gigId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gig? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(gigId);

      const { data } = await axios.delete(`${API_URL}/api/v1/gigs/${gigId}`, {
        withCredentials: true,
      });

      setGigs((prevGigs) => prevGigs.filter((gig) => gig._id !== gigId));

      toast.success(data.message || "Gig deleted successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete gig. You can delete only your own gig.",
      );
    } finally {
      setDeletingId(null);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const activeOrders = orders.filter((order) =>
      ["paid", "in_progress", "delivered"].includes(order.status),
    );

    const completedOrders = orders.filter(
      (order) => order.status === "completed",
    );

    const totalEarnings = completedOrders.reduce((total, order) => {
      return total + Number(order.price || order.amount || 0);
    }, 0);

    const totalRevenue = orders.reduce((total, order) => {
      if (
        ["paid", "in_progress", "delivered", "completed"].includes(order.status)
      ) {
        return total + Number(order.price || order.amount || 0);
      }

      return total;
    }, 0);

    const rating = freelancer?.rating || 0;

    return {
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      totalOrders: orders.length,
      totalGigs: gigs.length,
      totalEarnings,
      totalRevenue,
      rating,
    };
  }, [orders, gigs, freelancer]);

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return "bg-success-subtle text-success";
    }

    if (status === "delivered") {
      return "bg-primary-subtle text-primary";
    }

    if (status === "paid" || status === "in_progress") {
      return "bg-warning-subtle text-warning";
    }

    if (status === "cancelled") {
      return "bg-danger-subtle text-danger";
    }

    return "bg-secondary-subtle text-secondary";
  };

  const getDeadlineText = (deadline) => {
    if (!deadline) return "Not set";

    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 Day";

    return `${diffDays} Days`;
  };

  const freelancerAvatar =
    freelancer?.avatar?.url || "https://randomuser.me/api/portraits/men/32.jpg";

  const freelancerName = freelancer?.name || "Freelancer";

  const freelancerRole =
    freelancer?.role === "freelancer"
      ? "Freelancer"
      : freelancer?.role || "Seller";

  const recentOrders = orders.slice(0, 5);
  const myGigs = gigs.slice(0, 4);

  if (loading) {
    return (
      <>
        <FreelanceNavbar />
        <div className="freelancer-dashboard py-5">
          <div className="container text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-3 text-muted">Loading freelancer dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <FreelanceNavbar />
        <div className="freelancer-dashboard py-5">
          <div className="container">
            <div className="alert alert-danger text-center">{error}</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  const getUserAvatar = (person) => {
    if (person?.avatar?.url) return person.avatar.url;
    if (typeof person?.avatar === "string") return person.avatar;

    return "https://i.pravatar.cc/100?img=12";
  };
  return (
    <>
      <FreelanceNavbar />

      <div className="freelancer-dashboard py-4">
        <div className="container">
          {/* TOP HEADER */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-1">Freelancer Dashboard</h2>
              <p className="text-muted mb-0">
                Manage your gigs, orders, earnings, and profile.
              </p>
            </div>

            <Link
              to="/gigs/create"
              className="btn text-white fw-semibold px-4 py-2"
              style={{ backgroundColor: "#005450" }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create New Gig
            </Link>
          </div>

          {/* PROFILE CARD */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center g-4">
                <div className="col-lg-6">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={freelancerAvatar}
                      alt={freelancerName}
                      className="rounded-circle"
                      style={{
                        width: "76px",
                        height: "76px",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <h4 className="fw-bold mb-1">{freelancerName}</h4>

                      <p className="text-muted mb-1 text-capitalize">
                        {freelancerRole}
                      </p>

                      <div className="d-flex align-items-center gap-2 small">
                        <span className="text-warning">
                          <i className="bi bi-star-fill"></i>
                        </span>
                        <strong>{stats.rating}</strong>
                        <span className="text-muted">
                          ({stats.completedOrders} Completed Orders)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="row text-center g-3">
                    <div className="col-4">
                      <h5 className="fw-bold mb-0">{stats.totalOrders}</h5>
                      <small className="text-muted">Total Orders</small>
                    </div>

                    <div className="col-4 border-start border-end">
                      <h5 className="fw-bold mb-0">
                        ${freelancer?.walletBalance || 0}
                      </h5>
                      <small className="text-muted">Wallet Balance</small>
                    </div>

                    <div className="col-4">
                      <h5 className="fw-bold mb-0">{stats.totalGigs}</h5>
                      <small className="text-muted">Active Gigs</small>
                    </div>
                  </div>
                </div>
              </div>

              {freelancer?.bio && (
                <p className="text-muted mt-4 mb-0">{freelancer.bio}</p>
              )}

              {Array.isArray(freelancer?.skills) &&
                freelancer.skills.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {freelancer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-dark border px-3 py-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="row g-4 mb-4">
            <div className="col-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-bag-check"></i>
                </div>
                <h4>{stats.activeOrders}</h4>
                <p>Active Orders</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-briefcase"></i>
                </div>
                <h4>{stats.totalGigs}</h4>
                <p>Total Gigs</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-star-fill"></i>
                </div>
                <h4>{stats.rating}</h4>
                <p>Rating</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="dashboard-stat-card">
                <div className="stat-icon bg-danger-subtle text-danger">
                  <i className="bi bi-wallet2"></i>
                </div>
                <h4>${stats.totalRevenue}</h4>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* LEFT SIDE */}
            <div className="col-lg-8">
              {/* RECENT ORDERS */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold mb-0">Recent Orders</h5>

                    <Link
                      to="/freelancer/orders"
                      className="btn btn-sm btn-outline-success"
                    >
                      View All
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-4">
                      <h6 className="fw-bold">No orders yet</h6>
                      <p className="text-muted mb-0 small">
                        Your client orders will appear here.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="table-responsive"
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto",
                      }}
                    >
                      <table className="table align-middle mb-0">
                        <thead
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "#fff",
                            zIndex: 10,
                          }}
                        >
                          <tr>
                            <th>Person</th>
                            <th>Your Role</th>
                            <th>Service</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentOrders.map((order) => {
                            const person = order.otherUser;

                            const personAvatar = getUserAvatar(person);

                            const personName =
                              person?.name ||
                              (order.currentUserRoleInOrder === "seller"
                                ? "Client"
                                : "Seller");

                            const roleLabel =
                              order.currentUserRoleInOrder === "seller"
                                ? "Seller"
                                : "Buyer";

                            const roleBadge =
                              order.currentUserRoleInOrder === "seller"
                                ? "bg-success-subtle text-success"
                                : "bg-primary-subtle text-primary";

                            return (
                              <tr key={order._id}>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <img
                                      src={personAvatar}
                                      alt={personName}
                                      className="rounded-circle"
                                      style={{
                                        width: "34px",
                                        height: "34px",
                                        objectFit: "cover",
                                      }}
                                    />

                                    <span className="fw-semibold">
                                      {personName}
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  <span className={`badge ${roleBadge}`}>
                                    {roleLabel}
                                  </span>
                                </td>

                                <td>{order.title || order.gig?.title}</td>

                                <td>${order.price || order.amount || 0}</td>

                                <td>
                                  <span
                                    className={`badge ${getStatusBadge(
                                      order.status,
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>

                                <td>{getDeadlineText(order.deadline)}</td>

                                <td>
                                  <Link
                                    to={`/orders/${order._id}`}
                                    className="btn btn-outline-success btn-sm fw-bold"
                                  >
                                    View Order
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* MY GIGS */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold mb-0">My Gigs</h5>
                  </div>

                  {myGigs.length === 0 ? (
                    <div className="text-center py-4">
                      <h6 className="fw-bold">No gigs created yet</h6>
                      <p className="text-muted small mb-3">
                        Create your first gig and start selling your service.
                      </p>

                      <Link
                        to="/gigs/create"
                        className="btn btn-success fw-semibold"
                      >
                        Create Gig
                      </Link>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {myGigs.map((gig) => {
                        const basicPackage = gig.packages?.basic;
                        const gigPrice = basicPackage?.price || 0;
                        const gigTitle = basicPackage?.title || gig.title;

                        return (
                          <div className="col-md-6" key={gig._id}>
                            <div className="my-gig-card">
                              {gig.cover ? (
                                <img
                                  src={gig.cover}
                                  alt={gig.title}
                                  className="gig-thumb"
                                />
                              ) : (
                                <div className="gig-thumb"></div>
                              )}

                              <div className="w-100">
                                <h6 className="fw-bold mb-1">{gigTitle}</h6>

                                <p className="text-muted small mb-2">
                                  {gig.category}
                                </p>

                                <div className="d-flex align-items-center justify-content-between gap-2">
                                  <strong style={{ color: "#005450" }}>
                                    ${gigPrice}
                                  </strong>

                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger fw-semibold"
                                    disabled={deletingId === gig._id}
                                    onClick={() => handleDeleteGig(gig._id)}
                                  >
                                    {deletingId === gig._id ? (
                                      <>
                                        <span
                                          className="spinner-border spinner-border-sm me-1"
                                          role="status"
                                          aria-hidden="true"
                                        ></span>
                                        Deleting
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-trash me-1"></i>
                                        Delete
                                      </>
                                    )}
                                  </button>
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
            {/* RIGHT SIDE */}
            <div className="col-lg-4">
              {/* QUICK ACTIONS */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Quick Actions</h5>

                  <div className="d-grid gap-3">
                    <Link
                      to="/gigs/create"
                      className="btn btn-success fw-semibold py-2"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Gig
                    </Link>

                    <Link
                      to="/Setting"
                      className="btn btn-outline-success fw-semibold py-2"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Setting
                    </Link>

                    <Link
                      to="/messages"
                      className="btn btn-outline-success fw-semibold py-2"
                    >
                      <i className="bi bi-chat-dots me-2"></i>
                      Messages
                    </Link>

                    <button className="btn btn-outline-success fw-semibold py-2">
                      <i className="bi bi-wallet2 me-2"></i>
                      Withdraw Earnings
                    </button>
                  </div>
                </div>
              </div>

              {/* PERFORMANCE */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Performance</h5>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-semibold">
                        Order Completion
                      </span>
                      <span className="small text-muted">
                        {stats.totalOrders
                          ? Math.round(
                              (stats.completedOrders / stats.totalOrders) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${
                            stats.totalOrders
                              ? Math.round(
                                  (stats.completedOrders / stats.totalOrders) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-semibold">
                        Active Order Rate
                      </span>
                      <span className="small text-muted">
                        {stats.totalOrders
                          ? Math.round(
                              (stats.activeOrders / stats.totalOrders) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${
                            stats.totalOrders
                              ? Math.round(
                                  (stats.activeOrders / stats.totalOrders) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-semibold">
                        Client Satisfaction
                      </span>
                      <span className="small text-muted">
                        {stats.rating
                          ? Math.round((stats.rating / 5) * 100)
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${
                            stats.rating
                              ? Math.round((stats.rating / 5) * 100)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
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

export default FreelancerDashboard;
