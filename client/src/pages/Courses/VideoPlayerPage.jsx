import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../layout/Footer.jsx";

const VideoPlayerPage = () => {
  const { courseId, videoId } = useParams();
  const videoRef = useRef(null);
const API_URL = import.meta.env.VITE_API_URL;
  const [video, setVideo] = useState(null);
  const [canMarkCompleted, setCanMarkCompleted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fetch video info
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/videos/${videoId}`,
          { withCredentials: true },
        );

        if (res.data.success) {
          setVideo(res.data.video);
        }
      } catch (err) {
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);
  // Track watch progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    const percent = Math.round((current / total) * 100);
    setProgress(percent);

    if (current / total >= 0.5) {
      setCanMarkCompleted(true);
    }
  };

  // Mark video completed
  const handleMarkCompleted = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/progress/mark-completed`,
        { courseId, videoId },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success("Video marked as completed!");
        setCompleted(true);
      }
    } catch (err) {
      toast.error("Failed to mark video as completed");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Back Button */}
        <Link
          to={`/courses-details/${courseId}`}
          className="btn btn-outline-secondary mb-4"
        >
          ← Back to Course
        </Link>

        {/* Video Card */}
        <div className="card shadow-sm rounded-4 p-4">
          {/* Video Title */}
          <h3 className="fw-bold mb-3">{video.title}</h3>

          {/* Video Player */}
          <div className="ratio ratio-16x9 mb-3 rounded-3 overflow-hidden shadow-sm">
            <video
              ref={videoRef}
              width="100%"
              controls
              onTimeUpdate={handleTimeUpdate}
              poster={video.thumbnailUrl}
            >
              <source src={video.videoUrl} type="video/mp4" />
            </video>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <small>Progress: {progress}%</small>
              {completed && (
                <span className="badge bg-success mb-2">Completed</span>
              )}
            </div>
            <div className="progress rounded-pill" style={{ height: "10px" }}>
              <div
                className={`progress-bar ${
                  progress >= 50 ? "bg-success" : "bg-warning"
                }`}
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          {/* Mark Completed Button */}
          <button
            className="btn btn-success btn-lg w-100 mt-3"
            disabled={!canMarkCompleted || completed}
            onClick={handleMarkCompleted}
          >
            {completed ? "✅ Completed" : "Mark Completed"}
          </button>

          {/* Info Message */}
          {!canMarkCompleted && !completed && (
            <p className="text-muted mt-2 text-center">
              Watch at least 50% of the video to unlock the “Mark Completed”
              button
            </p>
          )}

          {/* Video Description */}
          {video.description && (
            <div className="mt-4">
              <h5 className="fw-bold">Description</h5>
              <p className="text-muted">{video.description}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VideoPlayerPage;
