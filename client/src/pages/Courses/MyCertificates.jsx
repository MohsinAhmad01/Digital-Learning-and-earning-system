import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyCertificates = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/certificates/my-certificates`, { withCredentials: true });
        setCertificates(res.data.certificates);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [API_URL]);

  if (loading) return <div className="text-center py-5">Loading...</div>;

  if (!certificates.length) return <div className="text-center py-5">No certificates found.</div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">My Certificates</h3>
      <div className="row g-4">
        {certificates.map((cert) => (
          <div key={cert._id} className="col-md-4">
            <div className="card shadow-sm rounded-4 p-3 h-100">
              <h5 className="fw-bold mb-2">{cert.courseTitle}</h5>
              <p className="mb-1">Certificate ID: {cert.certificateId}</p>
              <p className="mb-2">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
              <Link
                to={`/certificate-preview/${cert.course}`}
                state={cert}
                className="btn btn-success w-100"
              >
                View / Download
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
