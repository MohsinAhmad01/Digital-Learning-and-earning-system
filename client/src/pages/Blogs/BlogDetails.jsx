import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../layout/Footer.jsx";
import "../../styles/BlogDetails.css";
const API_URL = import.meta.env.VITE_API_URL;
function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const blogRes = await axios.get(
          `${API_URL}/api/v1/blogs/${slug}`
        );

        if (blogRes.data.success) {
          setBlog(blogRes.data.blog);
        }

        const allBlogsRes = await axios.get(
          `${API_URL}/api/v1/blogs`
        );

        if (allBlogsRes.data.success) {
          const filtered = allBlogsRes.data.blogs
            .filter((item) => item.slug !== slug)
            .slice(0, 3);

          setPopularBlogs(filtered);
        }
      } catch (error) {
        console.log("Failed to load blog details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <h3>Blog not found</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="blog-detail-page">
        <section className="container blog-detail-container">
          <div className="blog-meta">
            <span>{blog.category}</span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          <h1>{blog.title}</h1>

          <img
            src={blog.coverImage}
            alt={blog.title}
            className="blog-cover-img"
          />

          <p className="blog-intro">{blog.shortDescription}</p>

          {blog.sections?.map((section, index) => (
            <div className="blog-content-section" key={index}>
              {section.heading && <h3>{section.heading}</h3>}

              {section.content && <p>{section.content}</p>}

              {section.quote && (
                <blockquote>
                  “{section.quote}”
                  {section.quoteAuthor && <small>- {section.quoteAuthor}</small>}
                </blockquote>
              )}

              {section.image && (
                <img
                  src={section.image}
                  alt={section.heading || blog.title}
                  className="section-img"
                />
              )}
            </div>
          ))}
        </section>

        <section className="container popular-post-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Popular Post</h2>
            <Link to="/blogs" className="view-all-btn">
              View All
            </Link>
          </div>

          <div className="row g-4">
            {popularBlogs.map((item) => (
              <div className="col-lg-4 col-md-6" key={item._id}>
                <div className="popular-card">
                  <Link to={`/blogs/${item.slug}`}>
                    <img src={item.coverImage} alt={item.title} />
                  </Link>

                  <small>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </small>

                  <h4>
                    <Link to={`/blogs/${item.slug}`}>{item.title}</Link>
                  </h4>

                  <p>{item.shortDescription?.slice(0, 100)}...</p>

                  <Link to={`/blogs/${item.slug}`} className="read-more">
                    Read More...
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default BlogDetails;