import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaPinterestP,
  FaApple,
  FaGooglePlay,
  FaGraduationCap,
} from "react-icons/fa";

import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>
              <FaGraduationCap /> DevTech
            </h2>
            <p>
              Aliquam rhoncus ligula est, non pulvinar elit convallis nec.
              Donec mattis odio at.
            </p>

            <div className="footer-social-boxes">
              <Link><FaFacebookF /></Link>
              <Link><FaInstagram /></Link>
              <Link className="active"><FaLinkedinIn /></Link>
              <Link><FaTwitter /></Link>
              <Link><FaYoutube /></Link>
            </div>
          </div>

          <div className="footer-col">
            <h5>TOP 4 CATEGORY</h5>
            <Link to="/courses">Career Growth</Link>
            <Link to="/freelance">Marketplace</Link>
            <Link to="/jobs">Jobs Market</Link>
            <Link to="/">AI/ML</Link>
          </div>

          <div className="footer-col">
            <h5>QUICK LINKS</h5>
            <Link to="/about">About</Link>
            <Link to="/faq-page">Have Some Doubts →</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/career">Career</Link>
          </div>

          <div className="footer-col">
            <h5>SUPPORT</h5>
            <Link to="/">Help Center</Link>
            <Link to="/faq-page">FAQs</Link>
            <Link to="/terms">Terms & Condition</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>

          <div className="footer-app">
            <h5>DOWNLOAD OUR APP</h5>

            <div className="app-link">
              <FaApple />
              <div>
                <small>Download now</small>
                <strong>App Store</strong>
              </div>
            </div>

            <div className="app-link">
              <FaGooglePlay />
              <div>
                <small>Download now</small>
                <strong>Play Store</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© DevTech International Ltd. 2026</p>

          <div className="footer-bottom-social">
            <Link><FaTwitter /></Link>
            <Link><FaFacebookF /></Link>
            <Link><FaLinkedinIn /></Link>
            <Link><FaPinterestP /></Link>
            <Link><FaInstagram /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;