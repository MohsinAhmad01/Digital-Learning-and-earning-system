import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CertificateForm = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
const API_URL = import.meta.env.VITE_API_URL;
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    cnic: "",
    relation: "S/O",
  });

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/courses/${courseId}`
        );
        setCourse(res.data.course);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API_URL}/api/v1/certificates/generate/${courseId}`,
      {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        relation: formData.relation,
        cnic: formData.cnic,
        courseTitle: course?.title,
        courseCategory: course?.category,
        courseLevel: course?.level,
      },
      { withCredentials: true }
    );

    // Redirect to preview regardless of new or existing certificate
    navigate(`/certificate-preview/${courseId}`, {
      state: res.data.certificate,
    });
  } catch (err) {
    console.error(err);
  }
};

  if (!course) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="card shadow rounded-4 p-4 col-md-6 mx-auto">
        <h3 className="fw-bold text-center mb-4">
          Generate Certificate for:
        </h3>

        <h5 className="text-center text-success mb-4">{course.title}</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Relationship</label>
            <select
              name="relation"
              className="form-select"
              value={formData.relation}
              onChange={handleChange}
              required
            >
              <option value="S/O">S/O (Son of)</option>
              <option value="D/O">D/O (Daughter of)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Father Name</label>
            <input
              type="text"
              name="fatherName"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CNIC</label>
            <input
              type="text"
              name="cnic"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success w-100 mt-3 fw-bold">
            Generate Certificate
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificateForm;
