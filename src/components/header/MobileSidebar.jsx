"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { HomeIcon as House, Car, BadgeCheck, NotebookPen, ChevronUp, ChevronDown } from "lucide-react"

const MobileSidebar = ({ show, onClose, categories }) => {
  const [activeTab, setActiveTab] = React.useState("menu")
  const location = useLocation()
  const siteinfos = useSelector((state) => state.home?.siteinfos[0])
  const media = useSelector((state) => state.home?.siteinfos?.media || [])

  const blogs = useSelector((state) => state.home?.blogs || [])
  const [showBlogSubmenu, setShowBlogSubmenu] = useState(false)

  // Debug logs to check data
  useEffect(() => {
    console.log("Blogs data:", blogs)
    console.log("Blog categories:", blogCategories)
    console.log("Blogs by category:", blogsByCategory)
  }, [blogs])

  // Group blogs by category - only if blogs exist and have length
  const blogCategories =
    blogs && blogs.length > 0
      ? [...new Set(blogs.map((blog) => (blog.blog_category ? blog.blog_category.name : null)))].filter(Boolean)
      : []

  const blogsByCategory = blogCategories.map((categoryName) => {
    const categoryBlogs = blogs.filter((blog) => blog.blog_category && blog.blog_category.name === categoryName)
    return {
      category: categoryBlogs[0]?.blog_category,
      blogs: categoryBlogs,
    }
  })

  return (
    <>
      {show && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}

      <div className={`offcanvas offcanvas-start ${show ? "show" : ""}`} tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fs-5">
            <Link className="navbar-brand mobile-logo" to="/">
              <img
                src={media[0]?.logo ?? ("../../../assets/images/logo/1727679220.webp" || "/placeholder.svg")}
                alt={siteinfos?.app_name ?? ""}
              />
            </Link>
          </h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>

        <div className="offcanvas-body mobile-sidebar-menu">
          <ul className="nav nav-tabs mb-3 border-bottom">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "menu" ? "active" : ""}`}
                onClick={() => setActiveTab("menu")}
              >
                Menu
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* Menu Tab */}
            <div className={`tab-pane fade ${activeTab === "menu" ? "show active" : ""}`} role="tabpanel">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${location.pathname === "/" ? "active" : ""}`}
                    to="/"
                    onClick={onClose}
                  >
                    <House size={20} strokeWidth={1.5} />
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${
                      location.pathname === "/car" ? "active" : ""
                    }`}
                    to="/car"
                    onClick={onClose}
                  >
                    <Car size={20} strokeWidth={1.5} />
                    Buy A New Car
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${
                      location.pathname === "/api" ? "active" : ""
                    }`}
                    to="/api"
                    onClick={onClose}
                  >
                    <BadgeCheck size={20} strokeWidth={1.5} />
                    Verify Auction Sheet
                  </Link>
                </li>

                <li className="nav-item">
                  <div className="d-flex flex-column">
                    <button
                      className={`nav-link d-flex align-items-center justify-content-between border-0 bg-transparent ${
                        location.pathname === "/blog" ? "active" : ""
                      }`}
                      onClick={() => setShowBlogSubmenu(!showBlogSubmenu)}
                    >
                      <div className="d-flex align-items-center gap-1">
                        <NotebookPen size={20} strokeWidth={1.5} />
                        Blog
                      </div>
                      {showBlogSubmenu ? (
                        <ChevronUp size={16} strokeWidth={1.5} />
                      ) : (
                        <ChevronDown size={16} strokeWidth={1.5} />
                      )}
                    </button>

                    {showBlogSubmenu && blogsByCategory.length > 0 && (
                      <div className="ms-4 mt-2 padding-left-20 blog-submenu">
                        {blogsByCategory.map(({ category, blogs }) => (
                          <div key={category?.id || "unknown"} className="mb-3">
                            <h6 className="fw-bold mb-2">{category?.name || "Uncategorized"}</h6>
                            <ul className="list-unstyled ps-2">
                              {blogs.map((blog) => (
                                <li key={blog.id} className="mb-2">
                                  <Link
                                    to={`/blog/${blog.slug}`}
                                    className="text-decoration-none d-block py-1"
                                    style={{ fontSize: "0.9rem" }}
                                    onClick={onClose}
                                  >
                                    {blog.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>

            {/* Categories Tab */}
            <div className={`tab-pane fade ${activeTab === "categories" ? "show active" : ""}`} role="tabpanel">
              <ul className="nav flex-column">
                {categories && categories.length > 0 ? (
                  categories.map((category, index) => {
                    const isActive =
                      location.pathname === "/filter" &&
                      new URLSearchParams(location.search).get("category") === category.slug

                    return (
                      <li className="nav-item" key={index}>
                        <Link
                          to={`/filter/?category=${category.slug}`}
                          className={`list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action ${
                            isActive ? "active" : ""
                          }`}
                          onClick={onClose}
                        >
                          <span>
                            <img
                              src={category.image || "placeholder-image-url"}
                              alt={category.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                marginRight: "10px",
                              }}
                            />
                            {category.name}
                          </span>
                        </Link>
                      </li>
                    )
                  })
                ) : (
                  <div className="text-center text-muted mt-3">No categories found.</div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileSidebar

