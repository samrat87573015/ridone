import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const blogs = useSelector((state) => state.home?.blogs || []);
  const [search, setSearch] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false); // State to track if search button is clicked

  // Get the 4 most recent blogs
  useEffect(() => {
    const sortedBlogs = [...blogs]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);
    setRecentBlogs(sortedBlogs);
  }, [blogs]);

  // Function to handle search button click
  const handleSearch = () => {
    setSearchClicked(true); // Mark that search button was clicked
    if (search.trim() === "") {
      setFilteredBlogs([]);
    } else {
      const searchResults = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBlogs(searchResults);
    }
  };

  return (
    <aside className="sidebar">
      <div className="blog_sidebar_item">
        {/* 🔍 Search Input with Button */}
        <div className="search-box d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary ms-2" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* 🔍 Search Results (if any) */}
        {searchClicked && filteredBlogs.length === 0 && search.trim() !== "" ? (
          <div className="no-results mt-4">
            <p>No posts found.</p>
          </div>
        ) : (
          filteredBlogs.length > 0 && (
            <div className="search-results mt-4">
              <h4 className="mb-3">Search Results</h4>
              <ul className="list-unstyled">
                {filteredBlogs.map((blog) => (
                  <li key={blog.id} className="mb-3">
                    <Link to={`/blog/${blog.slug}`} className="d-flex align-items-center">
                      {blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

      <div className="blog_sidebar_item">
        {/* 📰 Recent Blogs (Latest 4 Blogs) */}
        <div className="recent-blogs">
          <h3 className="mb-5">Recent Posts</h3>
          <ul className="list-unstyled">
            {recentBlogs.map((blog) => (
              <li key={blog.id} className="mb-3">
                <Link to={`/blog/${blog.slug}`} className="d-flex align-items-center">
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
