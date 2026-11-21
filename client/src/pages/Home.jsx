import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Hero from "../components/Hero";
import Footer from "../layout/Footer";
import { Context } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
const API_URL = import.meta.env.VITE_API_URL;
  const logout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Hero />
      <Footer />
      
    </>
  );
};

export default Home;
