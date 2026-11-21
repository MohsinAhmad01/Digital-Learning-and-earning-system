import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TeacherNavbar from "../TeacherAdmin/TeacherNavbar.jsx";
const API_URL = import.meta.env.VITE_API_URL;
const TeacherCourseVideos = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos of this course
  const fetchVideos = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/videos/courses/${courseId}`,
        { withCredentials: true },
      );

      setVideos(res.data.videos || []);
    } catch (err) {
      toast.error("Failed to load course videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [courseId]);

  // Delete video
  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/videos/${videoId}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Video deleted successfully");
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
    }
  };
  return (
    <>
      <TeacherNavbar />

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Course Videos</h3>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="alert alert-info text-center">
            No videos uploaded for this course yet.
          </div>
        ) : (
          <div className="row">
            {videos.map((video) => (
              <div className="col-md-4 mb-4" key={video._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold">{video.title}</h6>

                    <p className="text-muted small">
                      {video.description
                        ? video.description.slice(0, 90) + "..."
                        : "No description provided"}
                    </p>

                    <p className="text-muted small">
                      Uploaded:{" "}
                      {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>

                    <div className="mt-auto d-flex justify-content-between">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Watch
                      </a>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(video._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherCourseVideos;
