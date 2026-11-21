import React,{useContext, useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import JobNavbar from "./JobAdmin/JobNavbar";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { Context } from "../../context/AuthContext.jsx";
import { FaBriefcase,FaChartLine, FaFileAlt, FaUsers, FaStar, FaMapPin, FaClock, FaUserTie, FaPlus } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setIsAuthenticated, setUser, user } = useContext(Context);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/jobs/my-jobs`,
        { withCredentials: true }
      );
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/user/me`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchUser();
  }, []);

  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);
  const avgApplications = totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;
  const avgResponseRate = totalJobs > 0 ? Math.round((totalApplications / totalJobs) * 20) : 0; // demo

  // Main chart data (Applications trend)
  const chartData = {
    labels: jobs.slice(0, 5).map((j) => j.title.slice(0, 12) + "..."),
    datasets: [
      {
        label: "Applications",
        data: jobs.slice(0, 5).map(() => Math.floor(Math.random() * 20)), // demo data
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Simple sparkline replacement - animated bar
  const ApplicationTrend = ({ applications }) => (
    <div className="position-relative" style={{height: '60px'}}>
      <div className="position-absolute bottom-0 start-0 w-100 h-100 d-flex align-items-end">
        {Array.from({length: 7}).map((_, i) => (
          <div 
            key={i}
            className="flex-fill bg-gradient rounded mx-1"
            style={{
              height: `${Math.random() * 80 + 20}%`,
              background: 'linear-gradient(to top, #10b981, #34d399)',
              transition: 'height 0.3s ease',
              animation: 'sparkle 2s infinite'
            }}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <JobNavbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <JobNavbar />
      <div className="container-fluid p-4">
        <div className="row mb-5">
          <div className="col">
            <h1 className="fw-bold mb-1">
              Welcome back, <span className="text-primary">{user?.name || "Employer"}</span>!
            </h1>
            <p className="text-muted lead mb-0">
              Monitor your job postings and applicant engagement.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <Card className="shadow-lg border-0 h-100 text-center p-4 gradient-hover" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
              <FaBriefcase className="fs-1 text-primary mb-3 opacity-75" />
              <h3 className="fw-bold text-dark mb-1">{totalJobs}</h3>
              <p className="text-muted mb-0">Total Jobs</p>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="shadow-lg border-0 h-100 text-center p-4 gradient-hover" style={{background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'}}>
              <FaFileAlt className="fs-1 text-success mb-3 opacity-75" />
              <h3 className="fw-bold text-dark mb-1">{totalApplications}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="shadow-lg border-0 h-100 text-center p-4 gradient-hover" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'}}>
              <FaUsers className="fs-1 text-warning mb-3 opacity-75" />
              <h3 className="fw-bold text-dark mb-1">{avgApplications}</h3>
              <p className="text-muted mb-0">Avg per Job</p>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="shadow-lg border-0 h-100 text-center p-4 gradient-hover" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'}}>
              <FaChartLine className="fs-1 text-info mb-3 opacity-75" />
              <h3 className="fw-bold text-dark mb-1">{avgResponseRate}%</h3>
              <p className="text-muted mb-0">Response Rate</p>
            </Card>
            </Col>
        </Row>

        {/* Recent Applications Quick View */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="shadow-xl h-100 p-5">
              <h4 className="fw-bold mb-4">
                <FaUsers className="me-2 text-primary" /> Recent Activity
              </h4>
              <div className="row g-3">
                <Col md={6}>
                  <div className="border rounded p-3 h-100 d-flex flex-column justify-content-center text-center" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
                    <FaUserTie className="fs-1 text-success mx-auto mb-2" />
                    <h3 className="fw-bold mb-1">{totalApplications}</h3>
                    <p className="text-muted mb-0">New Applicants This Week</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3 h-100 d-flex flex-column justify-content-center text-center" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'}}>
                    <FaMapPin className="fs-1 text-warning mx-auto mb-2" />
                    <h3 className="fw-bold mb-1">{avgApplications}</h3>
                    <p className="text-muted mb-0">Avg Applications/Job</p>
                  </div>
                </Col>
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-xl h-100 p-4">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <div className="list-group list-group-flush">
                <Link to="/job/create" className="list-group-item list-group-item-action border-0 p-3">
                  <FaBriefcase className="me-3 text-primary fs-5 float-start" />
                  <div>
                    <h6 className="mb-1">Post New Job</h6>
                    <small className="text-muted">Reach 1000s of candidates</small>
                  </div>
                </Link>
                <Link to="/job/show-all" className="list-group-item list-group-item-action border-0 p-3">
                  <FaFileAlt className="me-3 text-success fs-5 float-start" />
                  <div>
                    <h6 className="mb-1">Review Applications</h6>
                    <small className="text-muted">{totalApplications} waiting</small>
                  </div>
                </Link>
                <Link to="/admin/all-jobs" className="list-group-item list-group-item-action border-0 p-3">
                  <FaUsers className="me-3 text-info fs-5 float-start" />
                  <div>
                    <h6 className="mb-1">Manage Jobs</h6>
                    <small className="text-muted">Edit or delete jobs</small>
                  </div>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Jobs Summary */}
        <h3 className="fw-bold mb-4">
          Recent Jobs <span className="badge bg-primary ms-2">{jobs.length}</span>
        </h3>
        <Row className="g-4">
          {jobs.slice(0, 6).map((job) => (
            <Col md={6} lg={4} key={job._id}>
              <Card className="shadow-lg border-0 h-100 p-4">
                <h6 className="fw-bold mb-2">{job.title}</h6>
                <p className="text-muted small mb-3">{job.company} • {job.location}</p>
                <div className="mb-3">
                  <p className="mb-2">
                    Applications: <strong>{job.applicationsCount || Math.floor(Math.random() * 15)}</strong>
                  </p>
                  <ProgressBar
                    now={Math.min((job.applicationsCount || 5) * 10, 100)}
                    label={`${
                      Math.min((job.applicationsCount || 5) * 10, 100)
                    }% fill`}
                    className="mb-3"
                    style={{height: '8px'}}
                  />
                </div>
                <div className="mb-3">
                  <ApplicationTrend applications={job.applicationsCount || 0} />
                </div>
                <Link to={`/job/applications/${job._id}`} className="btn btn-outline-primary btn-sm w-100">
                  View Applications
                </Link>
              </Card>
            </Col>
          ))}
        </Row>

        {jobs.length === 0 && (
          <div className="text-center py-5 mt-5">
            <div style={{
              height: '120px',
              width: '120px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <FaBriefcase style={{fontSize: '4rem', color: 'white'}} />
            </div>
            <h3 className="fw-bold text-muted mb-3">No Active Jobs</h3>
            <p className="lead text-muted mb-4">Create your first job posting to start receiving applications from qualified candidates.</p>
            <Link 
              to="/job/create" 
              className="btn px-5 py-3 fw-bold fs-5"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                borderRadius: '50px',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
              }}
            >
              <FaPlus className="me-2" /> Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDashboard;
