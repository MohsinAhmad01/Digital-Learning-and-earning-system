import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../../context/AuthContext.jsx";
import FreelanceNavbar from "../FreelanceNavbar.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderDetails() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { orderId } = useParams();
  const { user } = useContext(Context);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [milestonePercent, setMilestonePercent] = useState("");

  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const fetchOrder = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API_URL}/api/v1/orders/${orderId}`, {
        withCredentials: true,
      });

      setOrder(data.order);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send milestone request.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleRequestMilestone = async () => {
    try {
      if (!milestoneTitle || !milestonePercent) {
        toast.error("Please fill all milestone fields.");
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/api/v1/orders/milestone/request`,
        {
          orderId: order._id,
          title: milestoneTitle,
          percent: milestonePercent,
          description: milestoneDescription,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Milestone request sent.");

      setMilestoneTitle("");
      setMilestonePercent("");
      setMilestoneDescription("");

      fetchOrder();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send milestone request.",
      );
    }
  };

  const handleConfirmMilestonePaid = async (milestoneId) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/orders/milestone/confirm-paid`,
        {
          orderId: order._id,
          milestoneId,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Milestone marked as paid.");

      fetchOrder();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm payment.",
      );
    }
  };

  const handleDeliverOrder = async () => {
    try {
      if (!deliveryMessage.trim()) {
        toast.error("Delivery message required.");
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/api/v1/orders/deliver`,
        {
          orderId: order._id,
          deliveryFiles: [],
          deliveryMessage,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Order delivered.");

      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deliver order.");
    }
  };

  const handleApproveOrder = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/orders/approve`,
        {
          orderId: order._id,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Order approved.");
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve order.");
    }
  };
  const handleSubmitReview = async () => {
    try {
      if (!reviewRating) {
        toast.error("Please select rating.");
        return;
      }

      setReviewLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/v1/reviews`,
        {
          orderId: order._id,
          gigId: order.gig?._id || order.gig,
          rating: reviewRating,
          comment: reviewComment,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Review submitted successfully.");

      setReviewRating(5);
      setReviewComment("");

      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };
  if (loading) {
    return (
      <>
        <FreelanceNavbar />
        <div className="container py-5 text-center">Loading order...</div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <FreelanceNavbar />
        <div className="container py-5 text-center">Order not found.</div>
      </>
    );
  }

  const isSeller = order.seller?._id?.toString() === user?._id?.toString();
  const isBuyer = order.buyer?._id?.toString() === user?._id?.toString();
  const calculatedAmount = milestonePercent
    ? ((order?.price || 0) * Number(milestonePercent)) / 100
    : 0;
  return (
    <>
      <FreelanceNavbar />

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div className="mb-4">
                    <small className="text-muted">
                      Order ID: #{order._id.slice(-6).toUpperCase()}
                    </small>

                    <h2 className="fw-bold mt-2">{order.title}</h2>

                    <div className="d-flex gap-3 mt-2 flex-wrap">
                      <span>
                        Deadline:
                        <strong>
                          {" "}
                          {new Date(order.deadline).toLocaleDateString()}
                        </strong>
                      </span>

                      <span>
                        Budget:
                        <strong> ${order.price}</strong>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge px-3 py-2 ${
                      order.status === "completed"
                        ? "bg-success"
                        : order.status === "delivered"
                          ? "bg-primary"
                          : "bg-warning text-dark"
                    }`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <hr />

                <div className="row text-center">
                  <div className="col-md-3 col-6 mb-3">
                    <h5 className="fw-bold mb-0">${order.price}</h5>
                    <small className="text-muted">Total Amount</small>
                  </div>

                  <div className="col-md-3 col-6 mb-3">
                    <h5 className="fw-bold mb-0">${order.paidAmount || 0}</h5>
                    <small className="text-muted">Paid</small>
                  </div>

                  <div className="col-md-3 col-6 mb-3">
                    <h5 className="fw-bold mb-0">
                      ${order.remainingAmount || 0}
                    </h5>
                    <small className="text-muted">Remaining</small>
                  </div>

                  <div className="col-12 mt-3">
                    <small className="fw-semibold">
                      Project Progress ({order.progressPercent || 0}%)
                    </small>

                    <div className="progress mt-2" style={{ height: "10px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${order.progressPercent || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MILESTONES LIST */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Milestone Payments</h5>

                {order.milestones?.length === 0 ? (
                  <div className="text-center py-4">
                    <i
                      className="bi bi-cash-stack"
                      style={{
                        fontSize: "40px",
                        color: "#00635d",
                      }}
                    />

                    <p className="mt-3 text-muted">
                      No milestone requests have been created yet.
                    </p>
                  </div>
                ) : (
                  order.milestones?.map((milestone) => (
                    <div
                      className="border rounded-4 p-3 mb-3"
                      key={milestone._id}
                      style={{
                        borderLeft:
                          milestone.status === "paid"
                            ? "5px solid #198754"
                            : "5px solid #ffc107",
                        border: "1px solid #eee",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                          <h6 className="fw-bold mb-1">{milestone.title}</h6>

                          <p className="text-muted small mb-2">
                            {milestone.description || "No description added."}
                          </p>

                          <span className="badge bg-light text-dark me-2">
                            {milestone.percent}% completed
                          </span>

                          <span className="badge bg-success">
                            ${milestone.amount}
                          </span>
                        </div>

                        <span
                          className={`badge ${
                            milestone.status === "paid"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>

                      {isBuyer && milestone.status === "requested" && (
                        <button
                          className="btn btn-outline-success fw-bold mt-3"
                          onClick={() =>
                            handleConfirmMilestonePaid(milestone._id)
                          }
                        >
                          <i className="bi bi-check-circle me-2"></i>I Paid This
                          Milestone
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DELIVERY SECTION */}
            {order.deliveryMessage && (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Delivery Message</h5>
                  <p className="text-muted mb-0">{order.deliveryMessage}</p>
                </div>
              </div>
            )}
            {/* REVIEW SECTION */}
            {isBuyer && order.status === "completed" && !order.isReviewed && (
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Write a Review</h5>

                  <p className="text-muted small">
                    Share your experience after completing this order.
                  </p>

                  <div className="mb-3">
                    <label className="fw-semibold mb-2">Rating</label>

                    <select
                      className="form-select"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Average</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold mb-2">Comment</label>

                    <textarea
                      className="form-control"
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your feedback about the seller and service..."
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="btn text-white fw-bold"
                    style={{ backgroundColor: "#00635d" }}
                    disabled={reviewLoading}
                    onClick={handleSubmitReview}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}

            {isBuyer && order.status === "completed" && order.isReviewed && (
              <div className="alert alert-success mt-4">
                <i className="bi bi-check-circle me-2"></i>
                Review submitted successfully for this order.
              </div>
            )}
          </div>

          <div
            className="col-lg-4"
            style={{
              position: "sticky",
              top: "90px",
              alignSelf: "flex-start",
            }}
          >
            {/* SELLER MILESTONE REQUEST FORM */}
            {isSeller &&
              order.status !== "completed" &&
              order.status !== "cancelled" && (
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">
                      Send Milestone Payment Request
                    </h5>

                    <input
                      className="form-control mb-3"
                      placeholder="Milestone title"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                    />

                    <select
                      className="form-select"
                      value={milestonePercent}
                      onChange={(e) => setMilestonePercent(e.target.value)}
                    >
                      <option value="">Select Work Completed</option>
                      <option value="10">10%</option>
                      <option value="20">20%</option>
                      <option value="30">30%</option>
                      <option value="40">40%</option>
                      <option value="50">50%</option>
                      <option value="60">60%</option>
                      <option value="70">70%</option>
                      <option value="80">80%</option>
                      <option value="90">90%</option>
                      <option value="100">100%</option>
                    </select>
                    <div className="alert alert-info">
                      Payment Request Amount:
                      <strong> ${calculatedAmount}</strong>
                    </div>
                    <textarea
                      className="form-control mb-3"
                      rows="4"
                      placeholder="Describe completed work..."
                      value={milestoneDescription}
                      onChange={(e) => setMilestoneDescription(e.target.value)}
                    ></textarea>

                    <button
                      type="button"
                      className="btn text-white fw-bold w-100"
                      style={{ backgroundColor: "#00635d" }}
                      onClick={handleRequestMilestone}
                    >
                      Send Milestone Request
                    </button>
                  </div>
                </div>
              )}

            {/* ACTIONS */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Order Actions</h5>

                {isSeller &&
                  order.status !== "completed" &&
                  order.status !== "delivered" && (
                    <>
                      <textarea
                        className="form-control mb-3"
                        rows="4"
                        placeholder="Write delivery notes..."
                        value={deliveryMessage}
                        onChange={(e) => setDeliveryMessage(e.target.value)}
                      />

                      <button
                        className="btn text-white fw-bold w-100 mb-3"
                        style={{ backgroundColor: "#00635d" }}
                        onClick={handleDeliverOrder}
                      >
                        Deliver Order
                      </button>
                    </>
                  )}

                {isBuyer && order.status === "delivered" && (
                  <button
                    className="btn btn-success fw-bold w-100 mb-3"
                    onClick={handleApproveOrder}
                  >
                    Approve Order
                  </button>
                )}

                <div className="small text-muted">
                  Seller can send milestone requests. Buyer can manually confirm
                  payment after paying outside the platform.
                </div>
              </div>
            </div>

            {/* PEOPLE */}
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Order People</h5>

                <p className="mb-2">
                  <strong>Buyer:</strong> {order.buyer?.name}
                </p>

                <p className="mb-0">
                  <strong>Seller:</strong> {order.seller?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
