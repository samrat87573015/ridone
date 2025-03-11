import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";

export default function Main() {
  const blogs = useSelector((state) => state.home?.blogs || []);

  // Group blogs by category
  const categorizedBlogs = blogs.reduce((acc, blog) => {
    if (!acc[blog.blog_category.name]) {
      acc[blog.blog_category.name] = [];
    }
    acc[blog.blog_category.name].push(blog);
    return acc;
  }, {});

  const [visibleBlogs, setVisibleBlogs] = useState({});

  // Update visibleBlogs state after blogs are loaded
  useEffect(() => {
    const savedVisibility =
      JSON.parse(localStorage.getItem("visibleBlogs")) || {};

    // Ensure we always default to 3 posts per category
    const initialVisibility = Object.keys(categorizedBlogs).reduce(
      (acc, category) => {
        acc[category] = savedVisibility[category] ?? 3;
        return acc;
      },
      {}
    );

    setVisibleBlogs(initialVisibility);
  }, [blogs]); // Run this effect whenever blogs change

  // Update localStorage when state changes
  useEffect(() => {
    if (Object.keys(visibleBlogs).length > 0) {
      localStorage.setItem("visibleBlogs", JSON.stringify(visibleBlogs));
    }
  }, [visibleBlogs]);

  // Function to show all posts in a category
  const handleReadAll = (category) => {
    setVisibleBlogs((prev) => ({
      ...prev,
      [category]: categorizedBlogs[category].length, // Show all posts
    }));
  };

  // Function to show only 3 posts again
  const handleShowLess = (category) => {
    setVisibleBlogs((prev) => ({
      ...prev,
      [category]: 3, // Reset to 3 posts
    }));
  };

  return (
    <main className="blog-section">
      {/* <pre>{JSON.stringify(categorizedBlogs, null, 2)}</pre> */}
      <div className="container">
        {Object.keys(categorizedBlogs).map((category) => (
          <div key={category} className="category-section mb-10 mt-10">
            <h2 className="category-title">{category}</h2>
            <div className="row g-4">
              {categorizedBlogs[category]
                .slice(0, visibleBlogs[category] || 3)
                .map((blog) => (
                  <div className="col-lg-4 col-md-6" key={blog.id}>
                    <div className="blog-card">
                      <div className="blog-image">
                        <Link to={`/blog/${blog.slug}`}><img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          className="img-fluid w-100"
                        /></Link>
                      </div>
                      <div className="blog-content">
                        {/* <div className="blog-date mb-3">
                          {new Date(blog.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div> */}
                        <span className="blog-category d-inline-block mb-5">{blog.blog_category.name}</span>
                        <h3 className="blog-title">
                          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>

                          <p>
                            {blog.description
                              .replace(/<[^>]*>/g, "")
                              .split(" ")
                              .slice(0, 15)
                              .join(" ")}
                            {blog.description.split(" ").length > 15 && "..."}
                          </p>

                        {/* <div className="blog-footer">
                          <Link to={`/blog/${blog.slug}`} className="read-more">
                            Read More <ArrowRight className="ms-2" size={18} />
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Buttons for Read All and Show Less */}
            <div className="text-center mt-4">
              {categorizedBlogs[category].length > 3 &&
                (visibleBlogs[category] < categorizedBlogs[category].length ? (
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleReadAll(category)}
                  >
                    Read All...
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleShowLess(category)}
                  >
                    Show Less
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
