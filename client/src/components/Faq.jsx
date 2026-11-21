import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Footer from "../layout/Footer";
function FAQ() {
  return (
    <>
      <Navbar />
      <section
        style={{
          background: "linear-gradient(135deg, #064e4b, #0f766e)",
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          color: "#fff",
        }}
      >
        {" "}
        <div className="text-center d-flex align-items-center justify-content-center flex-row w-100">
          <Link to="/" className="text-white text-decoration-none me-2">
            Home
          </Link>{" "}
          /
          <Link to="/Faq-page" className="text-white text-decoration-none ms-2">
            Faqs
          </Link>
        </div>
      </section>
      <div className="container my-5">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-semibold">Frequently asked questions</h1>

          <select className="form-select w-auto">
            <option>Students</option>
          </select>
        </div>

        {/* LAYOUT */}
        <div className="row g-4">
          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="list-group shadow-sm">
              <button className="list-group-item list-group-item-action active">
                General Platform Overview
              </button>
              <button className="list-group-item list-group-item-action">
                Learning & Courses
              </button>
              <button className="list-group-item list-group-item-action">
                Professional Services Marketplace
              </button>
              <button className="list-group-item list-group-item-action">
                Job Board
              </button>
              <button className="list-group-item list-group-item-action">
                Career Development
              </button>
              <button className="list-group-item list-group-item-action">
                Technical & Support
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="accordion shadow-sm" id="faqAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                  >
                    What is the Digital Services and Learning System?
                  </button>
                </h2>
                <div
                  id="faq1"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    The Digital Services and Learning System (DSLS) is an
                    all-in-one platform that combines online learning with
                    professional digital services.
                  </div>
                </div>
              </div>

              {/* ITEM 2 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2"
                  >
                    How does DSLS ensure the security of my personal and payment
                    data?
                  </button>
                </h2>
                <div
                  id="faq2"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    DSLS uses industry-standard security measures including SSL
                    encryption, secure authentication, and PCI-compliant payment
                    gateways.
                  </div>
                </div>
              </div>

              {/* ITEM 3 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq3"
                  >
                    What are the core features of the platform?
                  </button>
                </h2>
                <div
                  id="faq3"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    <ul className="mb-0">
                      <li>Online courses with certifications</li>
                      <li>Professional services marketplace</li>
                      <li>AI-powered learning recommendations</li>
                      <li>Job and project opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ITEM 4 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq4"
                  >
                    How does the AI-Powered Learning Assistant work?
                  </button>
                </h2>
                <div
                  id="faq4"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    The AI assistant analyzes your learning progress and career
                    goals to suggest courses, projects, and opportunities.
                  </div>
                </div>
              </div>

              {/* ITEM 5 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq5"
                  >
                    Who is the target audience for the platform?
                  </button>
                </h2>
                <div
                  id="faq5"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Students, professionals, freelancers, and businesses looking
                    for digital talent.
                  </div>
                </div>
              </div>

              {/* ITEM 6 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq6"
                  >
                    Is there a cost to use the platform?
                  </button>
                </h2>
                <div
                  id="faq6"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    DSLS offers free access to basic features, with
                    certifications
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-semibold">
                  Don’t find your answer?
                </h5>
                <p className="card-text small text-muted">
                  Write your question and our support team will help you.
                </p>

                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>

                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Message"
                    ></textarea>
                  </div>

                  <button className="btn btn-success w-100">
                    Submit Question
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FAQ;
