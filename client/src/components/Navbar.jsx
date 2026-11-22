import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/AuthContext";
import { toast } from "react-toastify";
import Setting from "../components/Setting.jsx"
const API_URL = import.meta.env.VITE_API_URL;
const Navbar = () => {
  const {
    setIsAuthenticated,
    isAuthenticated,
    setUser,
    user,
    loading,
    setLoading,
  } = useContext(Context);

  // ✅ Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/user/me`, {
          withCredentials: true,
        });

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
  const logout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // ✅ Role-based dashboard logic
  const dashboardLink = () => {
    if (!isAuthenticated) return { path: "/register", label: "Join" };

    switch (user?.role) {
      case "admin":
        return { path: "/admin/dashboard", label: "Dashboard" };
      case "teacher":
        return { path: "/teacher/dashboard", label: "Dashboard" };
      case "freelancer":
        return { path: "/freelancer/dashboard", label: "Dashboard" };
      case "job":
        return { path: "/job/dashboard", label: " Dashboard" };
      default:
        return { path: "/user/dashboard", label: "My Profile" };
    }
  };
  const { path, label } = dashboardLink();

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(90deg, #0a6f5a, #0a6f5a)",
        minHeight: "80px",
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand text-white"
          style={{
            fontFamily: "cursive",
            fontSize: "26px",
            fontWeight: "500",
          }}
        >
          DevTechs
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Explore
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/blogs" className="dropdown-item" >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    Categories
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/courses">
                LearnSphere
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/freelance">
                Freelance Now
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/jobs">
                Find Your Dream Jobs
              </Link>
            </li>
          </ul>
          {isAuthenticated && (
  <div className="dropdown ms-auto">
    <button
      className="btn d-flex align-items-center gap-2 border-0"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style={{ background: "transparent" }}
    >
      <img
        src={
          user?.avatar?.url ||
          user?.avatar ||
          "https://i.pravatar.cc/100?img=12"
        }
        alt="User"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #fff",
        }}
      />

      <span
        style={{
          color: "#fff",
          fontWeight: "500",
          fontSize: "14px",
          whiteSpace: "nowrap",
        }}
      >
        {user?.name || "Guest"}
      </span>

      <i
        className="bi bi-chevron-down"
        style={{ color: "#fff", fontSize: "12px" }}
      ></i>
    </button>

    <ul className="dropdown-menu dropdown-menu-end">
      <li>
        <Link className="dropdown-item" to={path}>
          <i className="bi bi-person me-2"></i>
          {label}
        </Link>
      </li>

      <li>
        <Link className="dropdown-item" to="/Setting">
          <i className="bi bi-gear me-2"></i>
          Settings
        </Link>
      </li>

      <li>
        <hr className="dropdown-divider" />
      </li>

      <li>
        <button
          className="dropdown-item text-danger"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </li>
    </ul>
  </div>
)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
