import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;
const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/blogs`);
      setBlogs(res.data.blogs || []);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/blogs/delete/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Blog deleted");
        fetchBlogs();
      }
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <AdminNavbar/>

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">All Blogs</h2>

          <Link to="/admin/create-blog" className="btn btn-success">
            Create Blog
          </Link>
        </div>

        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-md-4" key={blog._id}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />

                <div className="card-body">
                  <span className="badge bg-success mb-2">
                    {blog.category}
                  </span>

                  <h5 className="fw-bold">{blog.title}</h5>

                  <p className="text-muted">
                    {blog.shortDescription?.slice(0, 100)}...
                  </p>

                  <p className="small text-muted mb-3">
                    Views: {blog.views || 0}
                  </p>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/admin/edit-blog/${blog._id}`}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBlog(blog._id)}
                    >
                      Delete
                    </button>

                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="btn btn-outline-success btn-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <p className="text-center text-muted">No blogs found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllBlogs;