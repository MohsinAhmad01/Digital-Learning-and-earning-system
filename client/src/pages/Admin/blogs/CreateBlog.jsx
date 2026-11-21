import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "",
    tags: "",
    authorName: "",
    authorRole: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [sections, setSections] = useState([
    { heading: "", content: "", image: "", quote: "", quoteAuthor: "" },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (index, e) => {
    const updated = [...sections];
    updated[index][e.target.name] = e.target.value;
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      { heading: "", content: "", image: "", quote: "", quoteAuthor: "" },
    ]);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    data.append("coverImage", coverImage);
    data.append("sections", JSON.stringify(sections));

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/blogs/create`,
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Blog created successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <>
      <AdminNavbar/>

      <div className="container my-5">
        <h2 className="fw-bold mb-4">Create Blog</h2>

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="row g-3">
            <div className="col-md-6">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label>Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label>Short Description</label>
              <textarea
                name="shortDescription"
                className="form-control"
                rows="3"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-md-6">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                className="form-control"
                placeholder="AI, VR, Gaming"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Cover Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                required
              />
            </div>

            <div className="col-md-6">
              <label>Author Name</label>
              <input
                type="text"
                name="authorName"
                className="form-control"
                value={formData.authorName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Author Role</label>
              <input
                type="text"
                name="authorRole"
                className="form-control"
                value={formData.authorRole}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          <h4 className="fw-bold">Blog Sections</h4>

          {sections.map((section, index) => (
            <div className="border rounded p-3 mb-3" key={index}>
              <div className="mb-3">
                <label>Section Heading</label>
                <input
                  type="text"
                  name="heading"
                  className="form-control"
                  value={section.heading}
                  onChange={(e) => handleSectionChange(index, e)}
                />
              </div>

              <div className="mb-3">
                <label>Content</label>
                <textarea
                  name="content"
                  rows="5"
                  className="form-control"
                  value={section.content}
                  onChange={(e) => handleSectionChange(index, e)}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={section.image}
                  onChange={(e) => handleSectionChange(index, e)}
                />
              </div>

              <div className="mb-3">
                <label>Quote</label>
                <textarea
                  name="quote"
                  rows="2"
                  className="form-control"
                  value={section.quote}
                  onChange={(e) => handleSectionChange(index, e)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label>Quote Author</label>
                <input
                  type="text"
                  name="quoteAuthor"
                  className="form-control"
                  value={section.quoteAuthor}
                  onChange={(e) => handleSectionChange(index, e)}
                />
              </div>

              {sections.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSection(index)}
                >
                  Remove Section
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-success mb-3"
            onClick={addSection}
          >
            Add Section
          </button>

          <button type="submit" className="btn btn-success">
            Create Blog
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateBlog;