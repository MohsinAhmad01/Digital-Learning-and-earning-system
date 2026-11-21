import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TeacherNavbar from "../Admin/TeacherAdmin/TeacherNavbar.jsx";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { Context } from "../../context/AuthContext.jsx";
import { FaBook, FaUsers, FaEye, FaStar, FaVideo, FaChartBar, FaChalkboardTeacher, FaPlus } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
const API_URL = import.meta.env.VITE_API_URL;
  const { setIsAuthenticated, setUser, user } = useContext(Context);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/courses/my-courses`,
        { withCredentials: true }
      );
      setCourses(data.courses || []);
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/user/me`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const totalCourses = courses.length;
  const totalReviews = courses.reduce((acc, c) => acc + (c.reviews?.length || 0), 0);
  const totalViews = courses.reduce((acc, c) => acc + (c.views || 0), 0);
  const avgRating = courses.length > 0
    ? (courses.reduce((acc, c) => acc + (c.averageRating || 0), 0) / courses.length).toFixed(1)
    : "0";

  const EngagementTrend = ({ reviews, views }) => (
    <div className="position-relative" style={{ height: '60px' }}>
      <div className="position-absolute bottom-0 start-0 w-100 h-100 d-flex align-items-end p-1">
        <div 
          className="flex-fill bg-success rounded mx-1"
          style={{
            height: `${Math.min((reviews / 5) * 100, 80)}%`,
            transition: 'height 1s ease-in-out'
          }}
        />
        <div 
          className="flex-fill bg-warning rounded mx-1"
          style={{
            height: `${Math.min((views / 20) * 100, 80)}%`,
            transition: 'height 1s ease-in-out'
          }}
        />
      </div>
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
    hover: { 
      y: -10, 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div>
        <TeacherNavbar />
        <div className="container text-center py-5 mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TeacherNavbar />
      <div className="bg-light min-vh-100 py-2">
        {/* Simple professional header */}
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-8">
              <h1 className="fw-bold display-5 mb-2">Welcome back, {user?.name || "Teacher"}!</h1>
              <p className="lead text-muted mb-0">Your teaching dashboard - courses, students, and growth metrics.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="card border-0 shadow-sm p-4 bg-primary text-white rounded-4">
                <FaChalkboardTeacher className="fs-1 mb-3 opacity-90" />
                <h2 className="fw-bold mb-1">{totalCourses}</h2>
                <p className="mb-0 small fw-semibold">Active Courses</p>
              </div>
            </div>
          </div>
        </div>
      
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-5 position-relative" 
        style={{ color: 'white', zIndex: 2 }}
      >
      </motion.div>

      {/* Glassmorphism Stats */}
      <div className="container-fluid py-1">
        <Row className="g-4 mb-5 justify-content-center">
          <Col lg={3} md={6} className="text-center">
            <motion.div 
              className="glass-card p-4 rounded-4 shadow-lg h-100"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'rgba(248, 250, 252, 0.9)',
                border: '1px solid rgba(255,255,255,0.8)'
              }}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <FaBook className="fs-1 text-primary mb-3" />
              <h3 className="fw-bold mb-1">{totalCourses}</h3>
              <p className="text-muted mb-0 h6">Total Courses</p>
            </motion.div>
          </Col>
          <Col lg={3} md={6} className="text-center">
            <motion.div 
              className="glass-card p-4 rounded-4 shadow-lg h-100"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'rgba(236, 253, 245, 0.9)',
                border: '1px solid rgba(255,255,255,0.8)'
              }}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FaUsers className="fs-1 text-success mb-3" />
              <h3 className="fw-bold mb-1">{totalReviews}</h3>
              <p className="text-muted mb-0 h6">Student Reviews</p>
            </motion.div>
          </Col>
          <Col lg={3} md={6} className="text-center">
            <motion.div 
              className="glass-card p-4 rounded-4 shadow-lg h-100"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'rgba(254, 243, 199, 0.9)',
                border: '1px solid rgba(255,255,255,0.8)'
              }}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FaEye className="fs-1 text-warning mb-3" />
              <h3 className="fw-bold mb-1">{totalViews}</h3>
              <p className="text-muted mb-0 h6">Course Views</p>
            </motion.div>
          </Col>
          <Col lg={3} md={6} className="text-center">
            <motion.div 
              className="glass-card p-4 rounded-4 shadow-lg h-100"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'rgba(240, 249, 255, 0.9)',
                border: '1px solid rgba(255,255,255,0.8)'
              }}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FaStar className="fs-1 text-info mb-3" />
              <h3 className="fw-bold mb-1">{avgRating}⭐</h3>
              <p className="text-muted mb-0 h6">Avg Rating</p>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* Course Grid */}
      <div className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h3 className="fw-bold mb-0 display-6">📚 Your Courses</h3>
          <motion.button 
            className="btn btn-gradient-primary px-5 py-3 rounded-pill fw-bold shadow-lg fs-6"
            whileHover={{ scale: 1.05, boxShadow: '0 15px 35px rgba(0,123,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus className="me-2" />
            Create Course
          </motion.button>
        </div>

        <Row className="g-4">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <Col lg={4} md={6} key={course._id}>
                <motion.div 
                  className="h-100"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover="hover"
                >
                  <Card className="border-0 shadow-xl h-100 overflow-hidden rounded-4 course-card">
                    <div className="position-relative course-header">
                      <div className="course-image-placeholder h-100" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaVideo className="fs-1 text-white" />
                      </div>
                      <div className="course-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4">
                        <div className="course-stats d-flex gap-2 mb-2">
                          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill small fw-semibold">
                            {course.reviews?.length || 0} Reviews
                          </span>
                          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill small fw-semibold">
                            {course.views || 0}+ Views
                          </span>
                        </div>
                        <div className="rating-display">
                          <span className="text-white fw-bold fs-5 me-2">{course.averageRating?.toFixed(1) || '0.0'}</span>
                          <FaStar className="text-warning fs-5" />
                        </div>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-3 lh-lg">{course.title}</h5>
                      <p className="text-muted mb-4 lh-lg small">
                        {course.description?.slice(0, 120) || 'No description available...'}
                      </p>
                      <div className="progress mb-4" style={{ height: '10px' }}>
                        <div 
                          className="progress-bar bg-gradient-success rounded-3" 
                          role="progressbar"
                          style={{ width: `${Math.min((course.views || 0) / 10, 100)}%` }}
                          aria-valuenow={(course.views || 0) / 10}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small className="text-white fw-bold">{Math.min((course.views || 0) / 10, 100)}%</small>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <Link to={`/courses-details/${course._id}`} className="btn btn-outline-primary btn-sm flex-fill rounded-3">
                          View Details
                        </Link>
                        <Link to={`/teacher/edit-course/${course._id}`} className="btn btn-primary btn-sm flex-fill rounded-3">
                          Edit Course
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))
          ) : (
            <motion.div 
              className="col-12 text-center py-5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="empty-state glass-card p-5 rounded-4 shadow-xl mx-auto" style={{maxWidth: '600px'}}>
                <FaBook className="fs-1 text-muted mb-4 opacity-75" />
                <h3 className="fw-bold mb-3 text-muted">No Courses Created Yet</h3>
                <p className="lead text-muted mb-4">Get started by creating your first course and sharing your knowledge with students worldwide</p>
                <motion.button 
                  className="btn btn-primary px-6 py-3 rounded-pill fw-bold fs-6 shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,123,255,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus className="me-2" />
                  Create Your First Course
                </motion.button>
              </div>
            </motion.div>
          )}
        </Row>
      </div>

      {/* Floating Action Button */}
      <motion.div 
        className="fab position-fixed"
        style={{
          bottom: '2rem',
          right: '2rem',
          zIndex: 1050
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to="/teacher/create-course" className="btn btn-primary rounded-circle shadow-lg p-4 fs-4">
          <FaPlus />
        </Link>
      </motion.div>
    </div>
    </>
  );
};

export default TeacherDashboard;

