import "../styles/Terms.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "../layout/Footer.jsx";
import terms from "../assets/terms.png"
const termsData = [
  {
    title: "Acceptance of Terms",
    text: "By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. These terms apply to all users, including learners, instructors, service providers, employers, and visitors.",
  },
  {
    title: "Use of the Platform",
    text: "You agree to use DevTech only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.",
  },
  {
    title: "User Accounts",
    text: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and agree to notify us immediately of any unauthorized use.",
  },
  {
    title: "Content and Conduct",
    text: "You retain ownership of the content you post on our platform. By posting, you grant us a license to use, display, and distribute your content to provide our services. You agree not to post content that is unlawful, harmful, or infringes on others' rights.",
  },
  {
    title: "Payments & Refunds",
    text: "All payments are processed securely. Refunds are subject to our Refund Policy, which is available on our platform. Prices for services and courses are subject to change without prior notice.",
  },
  {
    title: "Intellectual Property",
    text: "All content, trademarks, and materials on DevTech are owned by us or our licensors. You may not copy, reproduce, or distribute any content without our prior written permission.",
  },
  {
    title: "Privacy and Data Protection",
    text: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.",
  },
  {
    title: "Disclaimers",
    text: "DevTech is provided as is and as available without warranties of any kind. We do not guarantee that the platform will be uninterrupted, secure, or error-free.",
  },
  {
    title: "Limitation of Liability",
    text: "To the maximum extent permitted by law, DevTech shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
  },
  {
    title: "Termination",
    text: "We reserve the right to suspend or terminate your account at any time if you violate these Terms & Conditions or engage in conduct that we believe is harmful to our platform or community.",
  },
  {
    title: "Changes to Terms",
    text: "We may update these Terms & Conditions from time to time. We will notify you of significant changes by posting the updated terms on this page and, where appropriate, via email.",
  },
  {
    title: "Governing Law",
    text: "These Terms & Conditions shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan.",
  },
  {
    title: "Contact Us",
    text: "If you have any questions about these Terms & Conditions, please contact our support team.",
  },
];
export default function Terms() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSidebarClick = (index) => {
    setActiveIndex(index);

    const element = document.getElementById(`term-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
    <Navbar />
    <div>
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6">
              <div className="d-flex breadcrumb-text mb-3">
                <Link to={"/"} className="text-decoration-none text-white">Home</Link> <span className="mx-2">›</span> Terms & Conditions
              </div>

              <h1 className="terms-title">Terms & Conditions</h1>

              <p className="terms-description">
                Please read these terms & conditions carefully before using
                our platform. By accessing and using DevTech, you agree to
                be bound by these Terms & Conditions.
              </p>
            </div>

            {/* Right Image */}
            <div className="col-lg-6 text-center">
              <img
                src={terms}
                alt="Terms and Conditions"
                className="img-fluid terms-image"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="terms-content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="terms-sidebar">
                <h6>On this page</h6>

                {termsData.map((item, index) => (
                  <button
                    key={index}
                    className={`sidebar-link ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleSidebarClick(index)}
                  >
                    <span>{index + 1}</span>
                    {item.title}
                  </button>
                ))}
              </div>

              <div className="agreement-card">
                <div className="shield-icon">🛡️</div>
                <h5>Your Agreement Matters</h5>
                <p>
                  These terms protect both you and our community. Please read
                  them carefully.
                </p>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="updated-box">
                Last Updated: June 10, 2026
              </div>

              <p className="intro-text">
                Welcome to DevTech. By accessing or using our platform, you
                agree to be bound by these Terms & Conditions, along with our
                Privacy Policy and any other policies referenced here.
              </p>

              <div className="terms-accordion">
                {termsData.map((item, index) => (
                  <div
                    className={`term-accordion-item ${
                      activeIndex === index ? "open" : ""
                    }`}
                    id={`term-${index}`}
                    key={index}
                  >
                    <button
                      className="term-accordion-header"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="term-title-wrap">
                        <span className="term-icon">{index + 1}</span>
                        <h4>
                          {index + 1}. {item.title}
                        </h4>
                      </div>

                      <span className="accordion-plus">
                        {activeIndex === index ? "−" : "+"}
                      </span>
                    </button>

                    {activeIndex === index && (
                      <div className="term-accordion-body">
                        <p className="fw-bold">{item.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}