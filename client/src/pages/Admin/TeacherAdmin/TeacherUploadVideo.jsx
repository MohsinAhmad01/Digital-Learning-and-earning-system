import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import TeacherNavbar from "../TeacherAdmin/TeacherNavbar.jsx";
const API_URL = import.meta.env.VITE_API_URL;
const TeacherUploadVideo = () => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");

  // Fetch only teacher's courses
  const fetchMyCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/courses/my-courses`, {
        withCredentials: true,
      });
      setCourses(data.courses || []);
    } catch (err) {
      toast.error("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoFile || !thumbnailFile || !course || !description) {
      return toast.error("Please fill all required fields.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("course", course);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("description", description);

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/videos/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Video uploaded successfully!");
        setTitle("");
        setCourse("");
        setVideoFile(null);
        setThumbnailFile(null);
      } else {
        toast.error("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "An error occurred during upload.",
      );
    }
  };

  if (loading) {
    return (
      <>
        <TeacherNavbar />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <TeacherNavbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Upload Video to Your Course</h2>

        {courses.length === 0 ? (
          <p className="text-danger">
            You don’t have any courses yet. Please create a course first.
          </p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Video Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Your Course *</Form.Label>
              <Form.Select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter video description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video File *</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Upload Video
            </Button>
          </Form>
        )}
      </div>
    </>
  );
};

export default TeacherUploadVideo;
