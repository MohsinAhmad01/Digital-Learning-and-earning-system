import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Setting.css";
import Navbar from "./Navbar.jsx";
const API_URL = import.meta.env.VITE_API_URL;
const Setting = () => {
  const { user, setUser } = useContext(Context);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");

      const cleanPhone = user.phone?.replace("+92", "") || "";
      setPhone(cleanPhone);

      setBio(user.bio || "");
      setCountry(user.country || "");

      setSkills(
        Array.isArray(user.skills) && user.skills.length > 0
          ? user.skills.join(", ")
          : ""
      );

      setLanguages(
        Array.isArray(user.languages) && user.languages.length > 0
          ? user.languages.join(", ")
          : ""
      );

      setAvatarPreview(user.avatar?.url || "");
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateSetting = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("phone", `+92${phone}`);
      formData.append("bio", bio);
      formData.append("country", country);

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const languagesArray = languages
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean);

      formData.append("skills", JSON.stringify(skillsArray));
      formData.append("languages", JSON.stringify(languagesArray));

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await axios.put(
        `${API_URL}/api/v1/user/Setting/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      setUser(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Setting update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="setting-page">
        <div className="setting-container">
          <div className="setting-header">
            <div>
              <h2>Profile Settings</h2>
              <p>
                Complete your profile information so buyers can understand your
                services better.
              </p>
            </div>
          </div>

          <form className="setting-layout" onSubmit={handleUpdateSetting}>
            {/* LEFT PROFILE CARD */}
            <div className="setting-profile-card">
              <div className="setting-cover"></div>

              <div className="setting-profile-content">
                <div className="setting-avatar-box">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="setting-avatar"
                    />
                  ) : (
                    <div className="setting-avatar-placeholder">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <label htmlFor="avatar" className="setting-avatar-upload">
                    <i className="bi bi-camera"></i>
                  </label>

                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="file-input"
                  />
                </div>

                <h3>{user?.name || "User Name"}</h3>
                <p>{user?.email}</p>

                <div className="setting-role-badge">
                  {user?.role || "user"}
                </div>

                <div className="setting-profile-note">
                  <i className="bi bi-info-circle"></i>
                  <span>
                    Your email address is locked for security and cannot be
                    changed.
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT FORM CARD */}
            <div className="setting-form-card">
              <div className="setting-section-title">
                <h4>Personal Information</h4>
                <p>Update your public profile details.</p>
              </div>

              <div className="setting-grid">
                <div className="setting-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="setting-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="setting-form-group">
                  <label>Phone Number</label>
                  <div className="setting-phone-box">
                    <span>+92</span>
                    <input
                      type="number"
                      placeholder="3000000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="setting-form-group">
                  <label>Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select country</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="setting-form-group full-width">
                  <label>Bio</label>
                  <textarea
                    rows="5"
                    maxLength="600"
                    placeholder="Tell buyers about your experience, services, and working style..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>

                  <small>{bio.length}/600 characters</small>
                </div>

                <div className="setting-form-group full-width">
                  <label>Skills</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB, UI Design"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />

                  <small>Separate skills with commas.</small>
                </div>

                <div className="setting-form-group full-width">
                  <label>Languages</label>
                  <input
                    type="text"
                    placeholder="English, Urdu, Pashto"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                  />

                  <small>Separate languages with commas.</small>
                </div>
              </div>

              <div className="setting-actions">
                <button type="submit" className="setting-update-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Setting;