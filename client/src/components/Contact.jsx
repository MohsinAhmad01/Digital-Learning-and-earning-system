import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import "../styles/Contact.css";
import Navbar from "./Navbar.jsx";
import Footer from "../layout/Footer.jsx";
const API_URL = import.meta.env.VITE_API_URL;
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("");
  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/v1/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send message");
    }

    setStatus("Message sent successfully!");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.log("Frontend Error:", error);
    setStatus(error.message || "Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="container">
            <h1>Contact Us</h1>
            <p>
              Have a question or need help? Send us a message and our team will
              get back to you as soon as possible.
            </p>
          </div>
        </section>

        <section className="container contact-wrapper">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>
              We’re here to help you with your project, support requests, and
              business inquiries.
            </p>

            <div className="info-box">
              <FaEnvelope />
              <div>
                <h4>Email</h4>
                <span>muhsinoptimist123@gmail.com</span>
              </div>
            </div>

            <div className="info-box">
              <FaPhoneAlt />
              <div>
                <h4>Phone</h4>
                <span>+92 346 8866719</span>
              </div>
            </div>

            <div className="info-box">
              <FaMapMarkerAlt />
              <div>
                <h4>Location</h4>
                <span>Peshawar, Pakistan</span>
              </div>
            </div>

            <div className="info-box">
              <FaClock />
              <div>
                <h4>Working Hours</h4>
                <span>Mon - Sat, 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send a message</h2>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label>Message</label>
              <textarea
                name="message"
                rows="6"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && <p className="form-status">{status}</p>}
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}