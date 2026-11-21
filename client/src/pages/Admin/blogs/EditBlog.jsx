import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/blogs`);

        const blog = res.data.blogs.find((item) => item._id === id);

        if (!blog) {
          toast.error("Blog not found");
          return;
        }

        setFormData({
          title: blog.title || "",
          shortDescription: blog.shortDescription || "",
          category: blog.category || "",
          tags: blog.tags?.join(", ") || "",
          authorName: blog.author?.name || "",
          authorRole: blog.author?.role || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
        });

        setSections(blog.sections || []);
      } catch {
        toast.error("Failed to fetch blog");
      }
    };

    fetchBlog();
  }, [id]);

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

    data.append("sections", JSON.stringify(sections));

    if (coverImage) {
      data.append("coverImage", coverImage);
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/v1/blogs/update/${id}`,
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Blog updated successfully");
        navigate("/admin/all-blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update blog");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container my-5">
        <h2 className="fw-bold mb-4">Edit Blog</h2>

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
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Change Cover Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
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
              <input
                type="text"
                name="heading"
                className="form-control mb-3"
                placeholder="Section heading"
                value={section.heading}
                onChange={(e) => handleSectionChange(index, e)}
              />

              <textarea
                name="content"
                rows="5"
                className="form-control mb-3"
                placeholder="Section content"
                value={section.content}
                onChange={(e) => handleSectionChange(index, e)}
                required
              ></textarea>

              <input
                type="text"
                name="image"
                className="form-control mb-3"
                placeholder="Image URL"
                value={section.image}
                onChange={(e) => handleSectionChange(index, e)}
              />

              <textarea
                name="quote"
                rows="2"
                className="form-control mb-3"
                placeholder="Quote"
                value={section.quote}
                onChange={(e) => handleSectionChange(index, e)}
              ></textarea>

              <input
                type="text"
                name="quoteAuthor"
                className="form-control mb-3"
                placeholder="Quote author"
                value={section.quoteAuthor}
                onChange={(e) => handleSectionChange(index, e)}
              />

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeSection(index)}
              >
                Remove Section
              </button>
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
            Update Blog
          </button>
        </form>
      </div>
    </>
  );
};

export default EditBlog;