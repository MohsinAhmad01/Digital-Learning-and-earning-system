import React, {useState } from "react";
import "../styles/PrivacyPolicy.css";
import Navbar from "./Navbar.jsx";
import Footer from "../layout/Footer.jsx";
import Privacy from "../assets/privacyPolicy.png";
import { Link } from "react-router-dom";
const privacyData = [
  {
    title: "Information We Collect",
    description:
      "We collect information you provide directly to us, such as your name, email address, profile information, and payment details. We also collect information automatically when you use our platform.",
    text: [
      "Personal information such as name, email, phone number, and profile details.",
      "Account information such as username, password, and preferences.",
      "Usage data including IP address, browser type, pages visited, and activity.",
    ],
  },
  {
    title: "How We Use Your Information",
    description:
      "We use your information to provide and improve our services, process transactions, communicate with you, and personalize your experience.",
    text: [
      "Provide and maintain our platform.",
      "Process payments and transactions.",
      "Communicate updates, offers, and support messages.",
      "Improve user experience and platform security.",
    ],
  },
  {
    title: "Information Sharing",
    description:
      "We do not sell your personal information. We may share your information with trusted service providers who assist us in operating our platform.",
    text: [
      "Service Providers: payment processing, hosting, analytics",
      "Legal Requirements: when required by law or to protect our rights",
      "Business Transfers: in case of merger, acquisition, or sale",
    ],
  },
  {
    title: "Data Security",
    description:
      "We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.",
    text: [
      "SSL encryption for data transmission",
      "Secure servers and encrypted databases",
      "Regular security audits and vulnerability assessments",
      "Access controls and employee training",
    ],
  },
  {
    title: "Your Rights",
    description:
      "You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.",
    text: [
      "Access and review your data",
      "Update or correct inaccurate information",
      "Request deletion of your account and data",
      "Opt out of marketing communications",
    ],
  },
  {
    title: "Cookies and Tracking",
    description:
      "We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can control cookie settings through your browser.",
    text: [
      "Essential Cookies: required for platform functionality",
      "Analytics Cookies: help us understand how you use our platform",
      "Preference Cookies: remember your settings and preferences",
    ],
  },
  {
    title: "Data Retention",
    description:
      "We retain your information for as long as necessary to provide our services and comply with legal obligations.",
    text: [
      "Account data: retained while your account is active",
      "Transaction records: retained for legal and tax purposes",
      "Usage data: anonymized after 24 months",
    ],
  },
  {
    title: "Children's Privacy",
    description:
      "Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13.",
    text: [
      "If we learn we have collected data from a child under 13, we will delete it",
      "Parents can contact us if they believe their child has provided data",
    ],
  },
  {
    title: "Third-Party Links",
    description:
      "Our platform may contain links to third-party websites. We are not responsible for their privacy practices.",
    text: [
      "Please review their privacy policies",
      "We recommend using trusted websites only",
    ],
  },
  {
    title: "International Transfers",
    description:
      "Your information may be transferred to and processed in countries other than your own.",
    text: [
      "We ensure appropriate safeguards are in place",
      " Data transfers comply with applicable privacy laws",
    ],
  },
  {
    title: "Changes to This Policy",
    description:
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.",
    text: [
      "Check this page regularly for updates",
      "Continued use means you accept the updated policy",
    ],
  },
  {
    title: "Contact Us",
    description:
      "If you have any questions about this Privacy Policy or our data practices, please contact us.",
    text: ["@Email: digitalservicesfyp@gmail.com. Phone: +92 313 84084 79"],
  },
];

function PrivacyPolicy() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSidebarClick = (index) => {
    setActiveIndex(index);

    const section = document.getElementById(`privacy-${index}`);
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <>
      <Navbar />
      <div>
        <section className="privacy-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="d-flex  privacy-breadcrumb">
                  <Link to={"/"} className="text-decoration-none text-white">Home</Link><span>›</span> Privacy Policy
                </div>

                <h1>Privacy Policy</h1>

                <p>
                  Your privacy is important to us. This Privacy Policy explains
                  how we collect, use, disclose, and protect your information
                  when you use our platform.
                </p>
              </div>

              <div className="col-lg-6 text-center">
                <img
                  src={Privacy}
                  alt="Privacy Policy"
                  className="img-fluid privacy-hero-img"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="privacy-content-section">
          <div className="container">
            <div className="row">
              {/* Left Side */}
              <div className="col-lg-3">
                <div className="privacy-sidebar">
                  <h6>On this page</h6>

                  {privacyData.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSidebarClick(index)}
                      className={`privacy-sidebar-link ${
                        activeIndex === index ? "active" : ""
                      }`}
                    >
                      <span>{index + 1}</span>
                      {item.title}
                    </button>
                  ))}
                </div>

                <div className="privacy-card">
                  <div className="privacy-card-icon">🛡️</div>
                  <h5>Your Privacy Matters</h5>
                  <p>
                    We are committed to protecting your personal information and
                    being transparent about our data practices.
                  </p>
                </div>

                <div className="quick-summary">
                  <h6>Quick Summary</h6>

                  <div className="summary-item">
                    <span>1</span>
                    <div>
                      <h6>We Collect</h6>
                      <p>Information you provide and usage data.</p>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span>2</span>
                    <div>
                      <h6>We Use</h6>
                      <p>To provide services and improve experience.</p>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span>3</span>
                    <div>
                      <h6>We Protect</h6>
                      <p>Your information with security measures.</p>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span>4</span>
                    <div>
                      <h6>Your Control</h6>
                      <p>You have rights to access and update data.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="col-lg-9">
                <div className="privacy-updated-box">
                  Last Updated: June 15, 2026
                </div>

                <p className="privacy-intro">
                  At DevTech, we are committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our platform.
                </p>

                <div className="privacy-accordion">
                  {privacyData.map((item, index) => (
                    <div
                      key={index}
                      id={`privacy-${index}`}
                      className={`privacy-accordion-item ${
                        activeIndex === index ? "open" : ""
                      }`}
                    >
                      <button
                        className="privacy-accordion-header"
                        onClick={() => toggleItem(index)}
                      >
                        <div className="privacy-title-wrap">
                          <span className="privacy-number">{index + 1}</span>
                          <h4>
                            {index + 1}. {item.title}
                          </h4>
                        </div>

                        <span className="privacy-arrow">
                          {activeIndex === index ? "−" : "+"}
                        </span>
                      </button>

                      {activeIndex === index && (
                        <div className="privacy-accordion-body">
                          <p className="privacy-description">
                            {item.description}
                          </p>

                          <ul>
                            {item.text.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
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
      <Footer/>
    </>
  );
}

export default PrivacyPolicy;
