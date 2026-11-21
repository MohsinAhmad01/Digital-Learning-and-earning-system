import React from "react";
import errorImg from "../assets/img404.png"; // your illustration
import Navbar from "./Navbar";

function Error() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Navbar />
      {/* MAIN CONTENT */}
      <div className="container flex-grow-1 d-flex align-items-center">
        <div className="row align-items-center w-100">
          {/* LEFT SECTION */}
          <div className="col-md-6 text-center text-md-start mb-5 mb-md-0">
            <h4 className="text-muted fw-semibold">Error 404</h4>

            <h1 className="fw-bold display-5 mb-3">Oops! page not found</h1>

            <p className="text-muted mb-4">
              Something went wrong. It looks like your requested page could not
              be found. The link may be broken or the page has been removed.
            </p>

            <button
              className="btn btn-dark px-4 py-2"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-md-6 text-center">
            <img src={errorImg} alt="404 error" className="img-fluid" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-top py-3">
        <div className="container">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-6 mb-2 mb-md-0 text-muted small">
              © 2025 - Example. Designed by{" "}
              <a
                href="mailto:bashirinam09@gmail.com"
                className="text-decoration-none"
              >
                bashirinam09@gmail.com
              </a>
              . All rights reserved.
            </div>

            <div className="col-md-6 d-flex justify-content-center justify-content-md-end gap-3 small">
              <a href="#" className="text-decoration-none text-muted">
                FAQs
              </a>
              <a href="#" className="text-decoration-none text-muted">
                Privacy Policy
              </a>
              <a href="#" className="text-decoration-none text-muted">
                Terms & Condition
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Error;
