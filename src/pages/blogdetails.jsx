"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Assuming these components are imported correctly
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/blog/Sidebar";
import axiosInstance from "../api/axiosInstance";
import { useLoading } from "../components/LoadingContext";
import { getUserData } from "../api/store/slices/userSlice";

export default function BlogDetails() {
  const { slug } = useParams();
  const { setLoading } = useLoading();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user || {});

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/blog/${slug}`);
        setBlog(response.data.data);

        // Fetch comments separately to ensure we have the correct structure
        fetchComments(response.data.data.id);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
    if (!user) {
      dispatch(getUserData());
    }
  }, [slug, setLoading, dispatch, user]);

  // Separate function to fetch comments
  const fetchComments = async (blogId) => {
    try {
      const response = await axiosInstance.get(`/blog-comments/${blogId}`);
      // Based on your API response, comments are in response.data.data
      setComments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Update the handleCommentSubmit function to ensure the new comment is properly structured and displayed:

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    const newComment = {
      blog_id: blog.id,
      user_id: user.id,
      name: commentName,
      email: commentEmail,
      comment: commentText,
    };

    try {
      const response = await axiosInstance.post(`/blog-comment`, newComment);

      await fetchComments(blog.id);
      // Clear the comment input fields
      setCommentText("");
      setCommentName("");
      setCommentEmail("");

      // Optional: Show a success message
      console.log("Comment added successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  // Handle changes to name and email inputs
  useEffect(() => {
    if (user) {
      setCommentName(user.name);
      setCommentEmail(user.email);
    }
  }, [user]);

  if (!blog) {
    return <div>Blog not found!</div>;
  }

  return (
    <>
      <Header />
      <main className="blog-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-header">
                <div className="blog-meta">
                  {/* <span className="blog-date">
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span> */}
                </div>
                <h1 className="blog-title">{blog.title}</h1>
                <p className="mb-5">{blog.short_description}</p>
                <span className="blog-category">
                  {blog.blog_category?.name}
                </span>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="featured-media">
                {blog.video_url ? (
                  <div className="video-container">
                    <iframe
                      src={blog.video_url.replace("watch?v=", "embed/")}
                      title={blog.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="featured-image">
                    <img
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      className="img-fluid rounded"
                    />
                  </div>
                )}
              </div>

              <div className="blog-content">
                <div
                  className="content-area"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              </div>

              <div className="blog-tags mt-4">
                <h4>Tags:</h4>
                <div className="tags-list">
                  {blog.tags && typeof blog.tags === "string"
                    ? JSON.parse(blog.tags).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag.value}
                        </span>
                      ))
                    : null}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <Sidebar />
            </div>

            <div className="col-lg-12">
              <div className="blog_comments_wrapper">
                {/* Comment Section */}
                <div className="comments-section mt-5 mb-5">
                  <h3>Comments ({comments.length})</h3>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="comment-box border rounded"
                      >
                        <div className="d-flex justify-content-between">
                          <strong>{comment.name}</strong>
                          <small className="text-muted">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-0 mt-2">{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* Comment Form */}
                <div className="comment-form mt-4 mb-5">
                  <h4>Leave a Comment</h4>
                  {user ? (
                    <form onSubmit={handleCommentSubmit}>
                      <div className="row">
                        {/* Name Input (Editable) */}
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control comment_input"
                            placeholder="Your Name"
                            value={commentName}
                            onChange={(e) => setCommentName(e.target.value)}
                            required
                          />
                        </div>

                        {/* Email Input (Editable) */}
                        <div className="col-md-6">
                          <input
                            type="email"
                            className="form-control comment_input"
                            placeholder="Your Email"
                            value={commentEmail}
                            onChange={(e) => setCommentEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Comment Textarea */}
                      <textarea
                        className="form-control comment_textarea"
                        placeholder="Write your comment here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="4"
                        required
                      ></textarea>

                      <button type="submit" className="btn btn-primary">
                        Post Comment
                      </button>
                    </form>
                  ) : (
                    <p className="text-danger">
                      ⚠️ Please <a href="/login">login</a> to comment.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
