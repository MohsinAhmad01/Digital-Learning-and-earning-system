import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/courses/allcourse`,
        {
          withCredentials: true,
        }
      );
      setCourses(data.courses || []);
    } catch (err) {
      toast.error("Failed to load courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoFile || !thumbnailFile || !course) {
      return toast.error("Please fill all required fields.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("course", course);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/videos/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
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
      toast.error("An error occurred during upload.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Upload Course Video</h2>

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
            <Form.Label>Select Course *</Form.Label>
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
      </div>
    </>
  );
};

export default UploadVideo;
