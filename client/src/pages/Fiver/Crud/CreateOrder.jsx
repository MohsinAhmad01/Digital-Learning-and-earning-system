import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import FreelanceNavbar from "../FreelanceNavbar.jsx";


function CreateOrder() {
const API_URL = import.meta.env.VITE_API_URL;
  const { gigId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const packageType = searchParams.get("package") || "basic";

  const [gig, setGig] = useState(null);
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPackage = useMemo(() => {
    return gig?.packages?.[packageType] || null;
  }, [gig, packageType]);

  const fetchGig = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/gigs/${gigId}`, {
        withCredentials: true,
      });

      setGig(data.gig || data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch gig.");
    }
  };

  useEffect(() => {
    fetchGig();
  }, [gigId]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!requirements.trim()) {
      alert("Please write your order requirements.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/v1/orders`,
        {
          gigId,
          packageType,
          requirements,
        },
        {
          withCredentials: true,
        }
      );

      alert("Order created successfully.");

      if (data.conversationId) {
        navigate(`/messages/${data.conversationId}`);
      } else {
        navigate("/my-orders");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  if (!gig || !selectedPackage) {
    return (
      <>
        <FreelanceNavbar />
        <div className="container py-5 text-center">Loading order page...</div>
      </>
    );
  }

  return (
    <>
      <FreelanceNavbar />

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-2">Create Order</h3>
                <p className="text-muted">
                  Write your requirements clearly so the seller can understand
                  your work.
                </p>

                <form onSubmit={handleCreateOrder}>
                  <div className="mb-4">
                    <label className="fw-bold mb-2">Order Requirements</label>

                    <textarea
                      className="form-control"
                      rows="8"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Example: I need a modern homepage design, responsive layout, green theme, and delivery within the selected package time..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn text-white fw-bold px-4 py-3"
                    style={{ backgroundColor: "#00635d" }}
                    disabled={loading}
                  >
                    {loading ? "Creating Order..." : "Create Order & Open Chat"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                <h6 className="fw-bold">{gig.title}</h6>

                <p className="text-muted small">
                  {selectedPackage.description}
                </p>

                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Package</span>
                  <strong className="text-capitalize">{packageType}</strong>
                </div>

                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Delivery</span>
                  <strong>{selectedPackage.deliveryTime} Days</strong>
                </div>

                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Revisions</span>
                  <strong>{selectedPackage.revisionNumber}</strong>
                </div>

                <div className="d-flex justify-content-between pt-3">
                  <h5>Total Amount</h5>
                  <h5 style={{ color: "#00635d" }}>
                    ${selectedPackage.price}
                  </h5>
                </div>

                <div className="alert alert-warning small mt-4 mb-0">
                  Payment is handled manually between buyer and seller. The
                  platform only tracks milestone payment status.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateOrder;