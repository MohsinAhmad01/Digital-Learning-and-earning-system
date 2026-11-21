import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx"
import Footer from "../../layout/Footer.jsx";
import "../../styles/Blog.css";
const API_URL = import.meta.env.VITE_API_URL;
function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/blogs`);

        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        }
      } catch (error) {
        console.log("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />

      <main className="blog-page">
        <section className="blog-header text-center">
          <div className="container">
            <p>OUR BLOGS</p>
            <h1>Find out all blogs from here</h1>
            <p>
              Our blogs are written from very research research and well-known
              writers so that we can provide you the best blogs and articles.
            </p>
          </div>
        </section>

        <section className="container blog-list-section">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
            </div>
          ) : (
            <div className="row g-4">
              {blogs.map((blog) => (
                <div className="col-lg-4 col-md-6" key={blog._id}>
                  <div className="blog-card">
                    <Link to={`/blogs/${blog.slug}`}>
                      <img src={blog.coverImage} alt={blog.title} />
                    </Link>

                    <div className="blog-card-body">
                      <small>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </small>

                      <h4>
                        <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                      </h4>

                      <p>{blog.shortDescription?.slice(0, 120)}...</p>

                      <Link to={`/blogs/${blog.slug}`} className="read-more">
                        Read More...
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {blogs.length === 0 && (
                <p className="text-center text-muted">No blogs found</p>
              )}
            </div>
          )}
        </section>

        <section className="blog-newsletter">
          <div className="container text-center">
            <h2>Get our stories delivered From us to your inbox weekly.</h2>

            <form className="newsletter-form">
              <input type="email" placeholder="Your Email" />
              <button type="submit">Get started</button>
            </form>

            <p>
              Get a response tomorrow if you submit by 9pm today. If we received
              after 9pm will get a response the following day.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Blog;