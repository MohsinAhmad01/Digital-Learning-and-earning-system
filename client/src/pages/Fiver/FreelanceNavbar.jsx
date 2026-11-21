import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Setting from "../../components/Setting.jsx";
import socket from "./socket.js";
const FreelanceNavbar = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { setIsAuthenticated, isAuthenticated, setUser, user, setLoading } =
    useContext(Context);

  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadMessageCount = async () => {
    try {
      if (!isAuthenticated || !user?._id) return;

      const { data } = await axios.get(
        `${API_URL}/api/v1/messages/unread-count`,
        {
          withCredentials: true,
        },
      );

      setUnreadMessageCount(data.totalUnread || 0);
    } catch (error) {
      console.log(
        error.response?.data?.message || "Failed to fetch unread messages.",
      );
    }
  };
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    socket.emit("joinUser", user._id);

    fetchUnreadMessageCount();

    socket.on("unreadMessageCountUpdated", fetchUnreadMessageCount);

    return () => {
      socket.off("unreadMessageCountUpdated", fetchUnreadMessageCount);
    };
  }, [isAuthenticated, user?._id]);
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
  }, [setUser, setIsAuthenticated, setLoading]);

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
  const handleBellClick = () => {
    navigate("/messages");
    setMobileOpen(false);
  };
  return (
    <>
      <style>
        {`
          .freelance-navbar {
            width: 100%;
            background: #ffffff;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
            position: sticky;
            top: 0;
            z-index: 999;
          }

          .navbar-container {
            max-width: 1500px;
            margin: 0 auto;
            padding: 0 38px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
          }

          .logo {
            font-size: 28px;
            font-weight: 900;
            color: #022c32;
            text-decoration: none;
            white-space: nowrap;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 34px;
          }

          .nav-link-custom {
            color: #0f172a;
            text-decoration: none;
            font-size: 14px;
            font-weight: 700;
            position: relative;
            padding: 27px 0;
            white-space: nowrap;
          }

          .nav-link-custom:hover {
            color: #006b63;
          }

          .nav-link-custom.active::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 19px;
            width: 100%;
            height: 2px;
            background: #006b63;
            border-radius: 50px;
          }

          .explore-link {
            color: #006b63;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .navbar-right {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .search-box {
            width: 320px;
            height: 42px;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 14px;
            background: #ffffff;
          }

          .search-box input {
            width: 100%;
            border: none;
            outline: none;
            font-size: 13px;
            color: #334155;
            background: transparent;
          }

          .search-box input::placeholder {
            color: #94a3b8;
          }

          .nav-icon {
            position: relative;
            font-size: 21px;
            color: #0f172a;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .notification-btn {
  border: none;
  background: transparent;
  padding: 0;
}

.notification-badge {
  position: absolute;
  top: -9px;
  right: -9px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #ef233c;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

          .user-box {
            display: flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
            cursor: pointer;
          }

          .user-box img {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
          }

          .user-box span {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
          }

          .join-btn {
            border: none;
            background: linear-gradient(135deg, #003f3c, #006b63);
            color: #ffffff;
            padding: 13px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 18px rgba(0, 107, 99, 0.22);
            white-space: nowrap;
          }

          .join-btn:hover {
            transform: translateY(-1px);
          }

          .mobile-toggle {
            display: none;
            width: 42px;
            height: 42px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
            border-radius: 10px;
            font-size: 24px;
            cursor: pointer;
            color: #0f172a;
          }

          .mobile-menu {
            display: none;
          }

          @media (max-width: 1320px) {
            .navbar-container {
              padding: 0 25px;
              gap: 18px;
            }

            .nav-links {
              gap: 22px;
            }

            .search-box {
              width: 250px;
            }

            .navbar-right {
              gap: 15px;
            }

            .nav-link-custom {
              font-size: 13px;
            }
          }

          @media (max-width: 1100px) {
            .search-box {
              width: 210px;
            }

            .nav-links {
              gap: 18px;
            }

            .join-btn {
              padding: 12px 18px;
            }
          }

          @media (max-width: 992px) {
            .navbar-container {
              height: 68px;
            }

            .desktop-links,
            .desktop-right {
              display: none;
            }

            .mobile-toggle {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mobile-menu {
              display: block;
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.35s ease;
              border-top: 1px solid #e5e7eb;
              background: #ffffff;
            }

            .mobile-menu.open {
              max-height: 650px;
            }

            .mobile-menu-content {
              padding: 18px 25px 24px;
              display: flex;
              flex-direction: column;
              gap: 18px;
            }

            .mobile-menu .nav-link-custom {
              padding: 0;
              font-size: 15px;
            }

            .mobile-menu .nav-link-custom.active::after {
              display: none;
            }

            .mobile-search {
              width: 100%;
            }

            .mobile-icons {
              display: flex;
              align-items: center;
              gap: 22px;
              padding: 8px 0;
            }

            .mobile-user-area {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              flex-wrap: wrap;
              border-top: 1px solid #e5e7eb;
              padding-top: 18px;
            }
          }

          @media (max-width: 576px) {
            .navbar-container {
              padding: 0 16px;
              height: 64px;
            }

            .logo {
              font-size: 24px;
            }

            .mobile-menu-content {
              padding: 16px;
            }

            .search-box {
              height: 44px;
            }

            .user-box img {
              width: 38px;
              height: 38px;
            }

            .join-btn {
              width: 100%;
              padding: 13px 20px;
            }

            .mobile-user-area {
              align-items: flex-start;
            }
          }
        `}
      </style>

      <header className="freelance-navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            DevTech
          </Link>

          <nav className="nav-links desktop-links">
            <ul className="navbar-nav">
              <li className="nav-item  dropdown">
                <Link
                  className="nav-link nav-link-custom fs-6 dropdown-toggle text-dark"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Explore
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Categories
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            <Link
              to="/courses"
              className={`nav-link-custom fs-6 ${
                pathname === "/courses" ? "active" : ""
              }`}
            >
              LearnSphere
            </Link>

            <Link
              to="/gigs"
              className={`nav-link-custom fs-6 ${
                pathname === "/gigs" ? "active" : ""
              }`}
            >
              Browse Gigs
            </Link>

            <Link
              to="/freelance"
              className={`nav-link-custom fs-6 ${
                pathname === "/freelance" ? "active" : ""
              }`}
            >
              Work Place
            </Link>
          </nav>

          <div className="navbar-right desktop-right">
            <div className="search-box">
              <span>⌕</span>
              <input type="text" placeholder="Search services..." />
            </div>

            <button
              type="button"
              className="nav-icon notification-btn"
              onClick={handleBellClick}
              title="Messages"
            >
              🔔
              {unreadMessageCount > 0 && (
                <span className="notification-badge">
                  {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn border-0 p-0 user-box"
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
                  />
                  <span>{user?.name || "Guest"}</span>
                  <i className="bi bi-chevron-down"></i>
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/freelancer/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/Setting">
                      <i className="bi bi-gear me-2"></i>
                      settings
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
            ) : null}
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
          <div className="mobile-menu-content">
            <div className="search-box mobile-search">
              <span>⌕</span>
              <input type="text" placeholder="Search services..." />
            </div>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <Link
                  className="nav-link nav-link-custom dropdown-toggle text-dark"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Explore
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Categories
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <Link
              to="/courses"
              className={`nav-link-custom ${
                pathname === "/courses" ? "active" : ""
              }`}
            >
              LearnSphere
            </Link>

            <Link
              to="/gigs"
              className={`nav-link-custom ${
                pathname === "/gigs" ? "active" : ""
              }`}
            >
              Browse Gigs
            </Link>

            <Link
              to="/freelance"
              className={`nav-link-custom ${
                pathname === "/freelance" ? "active" : ""
              }`}
            >
              Work Place
            </Link>

            <div className="mobile-icons">
              <button
                type="button"
                className="nav-icon notification-btn"
                onClick={handleBellClick}
                title="Messages"
              >
                🔔
                {unreadMessageCount > 0 && (
                  <span className="notification-badge">
                    {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                  </span>
                )}
              </button>
            </div>

            <div className="mobile-user-area">
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn border-0 p-0 user-box"
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
                    />
                    <span>{user?.name || "Guest"}</span>
                    <i className="bi bi-chevron-down"></i>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/freelancer/dashboard"
                      >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/Setting">
                        <i className="bi bi-gear me-2"></i>
                        settings
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/my-orders">
                        <i className="bi bi-bag me-2"></i>
                        My Orders
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
              ) : null}
              {/* 
              <button
                className="join-btn"
                onClick={() => navigate("/register")}
              >
                Join Now
              </button> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default FreelanceNavbar;
