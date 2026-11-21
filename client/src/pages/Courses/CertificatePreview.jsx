import React, { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import watermark from "../../assets/bashir.png";

const CertificatePreview = () => {
  const location = useLocation();
  const { id } = useParams();
  const certificateRef = useRef();

  const {
    fullName,
    fatherName,
    cnic,
    courseTitle,
    courseLevel,
    relation,
  } = location.state || {};

  // Random Certificate ID
  const certificateId = `DT-${Math.floor(100000 + Math.random() * 900000)}`;

  const issueDate = new Date().toLocaleDateString();

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    const input = certificateRef.current;

    // Clone certificate for consistent PDF layout
    const clone = input.cloneNode(true);
    clone.style.width = "1000px";
    clone.style.minHeight = "650px";
    clone.style.transform = "scale(1)";
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      logging: true,
      windowWidth: 1000,
      windowHeight: 650,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${certificateId}.pdf`);

    document.body.removeChild(clone);
  };

  return (
    <div className="container py-5">
      <div
        ref={certificateRef}
        className="position-relative mx-auto bg-white shadow-lg border border-2 rounded-4 p-4 p-md-5"
        style={{
          maxWidth: "1000px",
          minHeight: "650px",
          overflow: "hidden",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Watermark */}
        <img
          src={watermark}
          alt="Watermark"
          className="position-absolute"
          style={{
            opacity: 0.08,
            width: "80%", // scale watermark relative to container
            maxWidth: "700px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div className="text-center mb-4" style={{ zIndex: 1, position: "relative" }}>
          <h6 className="text-uppercase text-muted mb-1">DeveloperTechs</h6>
          <h1
            className="text-success fw-bold mb-2"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            Certificate of Completion
          </h1>
          <p className="text-muted small mb-0">
            Certificate ID: <strong>{certificateId}</strong>
          </p>
        </div>

        {/* Body */}
        <div className="text-center" style={{ zIndex: 1, position: "relative" }}>
          <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
            This is proudly presented to
          </p>
          <h2
            className="fw-bold my-2 border-bottom border-2 border-success d-inline-block pb-1"
            style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}
          >
            {fullName || "Full Name"}
          </h2>
    <p className="mb-1">
  {relation} <strong>{fatherName}</strong>
</p>
          <p>CNIC: <strong>{cnic || "12345-6789012-3"}</strong></p>

          <p className="mt-3" style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
            For successfully completing the professional course
          </p>
          <h4
            className="fw-bold text-dark my-2"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
          >
            {courseTitle || "Course Title"}
          </h4>
          <p className="text-muted mb-1">Level: {courseLevel || "Intermediate"}</p>

          <p className="mt-3" style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)" }}>
            This certificate acknowledges the dedication, commitment, and technical excellence demonstrated
            throughout the course. The recipient has met all requirements and shown proficiency in the skills taught.
          </p>

          <p style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)" }}>
            This achievement signifies a professional milestone and the beginning of further growth and mastery
            in the field of technology.
          </p>
        </div>

        {/* Footer */}
        <div
          className="row mt-5 align-items-center text-center text-md-start"
          style={{ zIndex: 1, position: "relative" }}
        >
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <p className="mb-1 fw-bold">Issue Date:</p>
            <p>{issueDate}</p>
          </div>

          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <div
              className="border-top border-2 border-dark w-50 mx-auto mb-1"
              style={{ height: "2px" }}
            ></div>
            <p className="mb-0 fw-bold">CEO</p>
            <p className="small text-muted">DeveloperTechs</p>
          </div>

          <div className="col-12 col-md-4 text-md-end">
            <div
              className="border-top border-2 border-dark w-50 ms-auto mb-1"
              style={{ height: "2px" }}
            ></div>
            <p className="mb-0 fw-bold">Director</p>
            <p className="small text-muted">DeveloperTechs</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 d-flex flex-column flex-md-row justify-content-center gap-3">
        <button className="btn btn-success px-4" onClick={handleDownload}>
          Download PDF
        </button>
        <button className="btn btn-outline-dark px-4" onClick={handlePrint}>
          Print
        </button>
      </div>
    </div>
  );
};

export default CertificatePreview;
