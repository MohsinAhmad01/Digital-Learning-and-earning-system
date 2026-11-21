import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
const Register = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const avatarRegister = register("avatar");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleRegister = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", `+92${data.phone}`);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("verificationMethod", data.verificationMethod);

      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      const res = await axios.post(
        `${API_URL}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      navigateTo(`/otp-verification/${data.email}/+92${data.phone}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <div>
        <form
          className="auth-form"
          onSubmit={handleSubmit(handleRegister)}
          encType="multipart/form-data"
        >
          <h2>Register</h2>

         <div style={{ width: "100%", marginBottom: "15px" }}>
  <label
    htmlFor="avatar"
    style={{
      display: "block",
      marginBottom: "8px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#111827",
    }}
  >
    Upload your picture
  </label>

  {avatarPreview && (
    <img
      src={avatarPreview}
      alt="Avatar Preview"
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "15px",
        border: "2px solid #e5e7eb",
        display: "block",
      }}
    />
  )}

  <input
    id="avatar"
    type="file"
    accept="image/*"
    name={avatarRegister.name}
    ref={avatarRegister.ref}
    onBlur={avatarRegister.onBlur}
    onChange={(e) => {
      avatarRegister.onChange(e);
      handleAvatarChange(e);
    }}
    style={{
      width: "100%",
      padding: "14px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      fontSize: "15px",
      outline: "none",
      backgroundColor: "#f9fafb",
      color: "#111827",
      cursor: "pointer",
    }}
  />
</div>

          <input
            type="text"
            placeholder="Name"
            required
            {...register("name")}
          />

          <input
            type="email"
            placeholder="Email"
            required
            {...register("email")}
          />

          <div>
            <span>+92</span>
            <input
              type="number"
              placeholder="Phone"
              required
              {...register("phone")}
            />
          </div>

          <input
            type="password"
            placeholder="Password"
            required
            {...register("password")}
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              fontSize: "15px",
              outline: "none",
              backgroundColor: "#f9fafb",
              color: "#111827",
            }}
          />

          <select
            {...register("role")}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              fontSize: "15px",
              outline: "none",
              backgroundColor: "#f9fafb",
              color: "#111827",
              cursor: "pointer",
            }}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
            <option value="freelancer">Freelancer</option>
            <option value="job">Job</option>
          </select>

          <div className="verification-method">
            <p>Select Verification Method</p>

            <div className="wrapper">
              <label>
                <input
                  type="radio"
                  value="email"
                  {...register("verificationMethod")}
                  required
                />
                Email
              </label>

              <label>
                <input
                  type="radio"
                  value="phone"
                  {...register("verificationMethod")}
                  required
                />
                Phone
              </label>
            </div>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;