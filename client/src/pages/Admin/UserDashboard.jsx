import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaGraduationCap, FaCheckCircle, FaBook } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/progress/dashboard`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="container py-5 text-center">
        <p>No dashboard data found.</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="container py-5">
      {/* 👤 User Info */}
      <div className="card shadow-sm rounded-4 mb-5 p-4 border-0" style={{ background: "linear-gradient(135deg,#0f766e,#064e4b)", color: "#fff" }}>
        <h4 className="fw-bold mb-1">
          Welcome, {data.user?.name} <FaGraduationCap className="ms-2" />
        </h4>
        <p className="mb-1 text-white-50">Email: {data.user?.email}</p>
        <p className="mb-0 text-white-50">phone: {data.user?.phone}</p>
        <p className="mb-0 text-white-50">Role: {data.user?.role}</p>
      </div>

      {/* 📚 Courses */}
      <h4 className="mb-4 fw-bold text-success">
        Your Courses <FaBook className="ms-2" />
      </h4>
      <div className="row g-4">
        {data.courses && data.courses.length > 0 ? (
          data.courses.map((item) => (
            <div key={item.course?._id} className="col-lg-4 col-md-6">
              <div className="card shadow-sm rounded-4 h-100 border-0">
                <div className="card-body">
<Link
  to={`/courses-details/${item.course?._id}`}
  className="text-decoration-none"
>
  <h5 className="fw-bold mb-3 text-dark course-title-hover">
    {item.course?.title}
  </h5>
</Link>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>{item.completedVideos || 0} / {item.totalVideos || 0} videos completed</small>
                      <small>{item.percentage || 0}%</small>
                    </div>
                    <div className="progress rounded-pill" style={{ height: "15px" }}>
                      <div
                        className={`progress-bar ${item.percentage === 100 ? "bg-success" : "bg-warning"}`}
                        role="progressbar"
                        style={{ width: `${item.percentage || 0}%` }}
                        aria-valuenow={item.percentage || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  {/* Certificate Button */}
           {item.percentage === 100 ? (
            <Link
    to={item.certificateGenerated ? `/certificate-preview/${item.course?._id}` : `/certificate-form/${item.course?._id}`}
    state={item.certificateData || null} // pass existing certificate if any
    className="btn btn-success w-100 mt-3 fw-bold"
  >
    <FaCheckCircle className="me-2" />
    {item.certificateGenerated ? "View Certificate" : "Generate Certificate"}
  </Link>
) : (
  <button className="btn btn-outline-secondary w-100 mt-3 fw-bold" disabled>
    Complete Course to Unlock Certificate
  </button>
)}
    </div>
      </div>
        </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted fs-5">You have not started any courses yet.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserDashboard;
