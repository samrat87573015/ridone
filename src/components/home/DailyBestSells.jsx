import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DailyBestSells() {
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  // Fetching blogs data from Redux
  const blogsData = useSelector((state) => state.home.blogs.slice(0, 4));
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  // Fetch blogs if not loaded
  useEffect(() => {
    if (blogsData.length === 0) {
      // Uncomment this when API integration is ready
      // dispatch(fetchHomeData());
    }
  }, [dispatch, blogsData]);

  // Show toast for error
  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  // Loading state
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  // If no blogs are available
  if (!blogsData.length) {
    return <div className="text-center py-5"></div>;
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="section-title">
            <h2 className="h3 ">Our Blog</h2>
          </div>
        </div>
      </div>

      <div className="row justify-content-start blog-list" >
        {blogsData.map((blog) => (
          <div
            key={blog.id}
            className="col-lg-3 col-md-6 col-sm-12 mb-4 blog-single"
          >
              <div className="blog-card">
                <div className="blog-image">
                  <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="img-fluid w-100" />
                </div>
                <div className="blog-content">
                  <div className="blog-date mb-3">
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="blog-title">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <div className="blog-footer">
                    <Link to={`/blog/${blog.slug}`} className="read-more">
                      Read More
                      <ArrowRight className="ms-2" size={18} />
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
