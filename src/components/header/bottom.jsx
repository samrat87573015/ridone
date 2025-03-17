"use client";

import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { fetchHomeData } from "../../api/homeservice";
import { useDispatch, useSelector } from "react-redux";
import {
  House,
  Car,
  BadgeCheck,
  NotebookPen,
  ChevronUp,
  ChevronDown,
  AlignJustify,
} from "lucide-react";
import {
  setActiveCart,
  selectCartTotal,
  selectCartItemCount,
} from "../../api/store/slices/cartSlice";
import MobileSidebar from "./MobileSidebar";

export default function Bottom() {
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const location = useLocation();

  const categories = useSelector((state) => state.home.categories.slice(0, 12));
  const loading = useSelector((state) => state.home.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const error = useSelector((state) => state.home.error);
  const { user } = useSelector((state) => state.user);
  const activecart = useSelector((state) => state.cart.activecart);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const [isOpen, setIsOpen] = useState(false);
  const [showBlogMenu, setShowBlogMenu] = useState(false);
  const blogMenuRef = useRef(null);

  const blogs = useSelector((state) => state.home?.blogs || []);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchHomeData());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  // Close blog mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blogMenuRef.current && !blogMenuRef.current.contains(event.target)) {
        setShowBlogMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const removeCartSection = () => {
    dispatch(setActiveCart(false));
  };

  const addCartSection = () => {
    dispatch(setActiveCart(true));
  };

  const addsidemenu = () => {
    document.querySelector(".sidemenu").classList.toggle("block");
  };

  const [showSidebar, setShowSidebar] = useState(false);

  const onOpen = () => {
    setShowSidebar(true);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Group blogs by category
  const blogCategories = [
    ...new Set(
      blogs.map((blog) => (blog.blog_category ? blog.blog_category.name : null))
    ),
  ].filter(Boolean);

  const blogsByCategory = blogCategories.map((categoryName) => {
    const categoryBlogs = blogs.filter(
      (blog) => blog.blog_category && blog.blog_category.name === categoryName
    );
    return {
      category: categoryBlogs[0]?.blog_category,
      blogs: categoryBlogs,
    };
  });

  return (
    <>
      <hr />
      <nav
        className="navbar navbar-expand-lg py-0 pb-lg-4"
        aria-label="Offcanvas navbar large"
      >
        <div className="container">
          <div
            className="offcanvas offcanvas-start"
            id="navbar-default"
            aria-labelledby="navbar-defaultLabel"
          >
            <div className="offcanvas-body justify-space-between">
              <div className="col-lg-3 col-xl-3">
                <div className="dropdown me-3">
                  <div
                    className="header_category_area position-relative"
                    style={{ maxWidth: "300px" }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center p-3 rounded-top-4"
                      onClick={toggleDropdown}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        borderBottom: isOpen ? "1px solid #eee" : "none",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        borderBottomLeftRadius: isOpen ? "0" : "16px",
                        borderBottomRightRadius: isOpen ? "0" : "16px",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          <AlignJustify size={20} strokeWidth={1.5} />
                        </span>
                        <span className="fw-medium">All Categories</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>

                    {isOpen && (
                      <div
                        className="position-absolute w-100 shadow-sm rounded-bottom-4 z-3"
                        style={{
                          backgroundColor: "#f8f9fa",
                          maxHeight: "300px",
                          overflowY: "auto",
                          top: "100%",
                          left: 0,
                          zIndex: 1000,
                        }}
                      >
                        <ul className="list-group list-group-flush">
                          {categories.map((category, index) => (
                            <li
                              key={index}
                              className="list-group-item border-0 py-2 d-flex align-items-center"
                              style={{ backgroundColor: "transparent" }}
                            >
                              <div className="heder_category_icon me-2">
                                <img
                                  src={category.image || "/placeholder.svg"}
                                  alt={category.name}
                                />
                              </div>
                              <Link
                                className="dropdown-item"
                                to={"/filter/?category=" + category?.slug}
                              >
                                {" "}
                                {category?.name}{" "}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex d-xl-none"></div>
              </div>

              <ul className="col-md-9 gap-14 menu_area navbar-nav align-items-center">
                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                    to="/"
                  >
                    <House size={20} strokeWidth={1.5} />
                    <span>Home</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${
                      location.pathname === "/car" ? "active" : ""
                    }`}
                    to="/car"
                  >
                    <Car strokeWidth={1.5} />
                    <span>Buy A New Car</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${
                      location.pathname === "/api" ? "active" : ""
                    }`}
                    to="/api"
                  >
                    <BadgeCheck size={20} strokeWidth={1.5} />
                    <span>Verify Auction Sheet</span>
                  </Link>
                </li>

                <li
                  className="nav-item position-relative"
                  ref={blogMenuRef}
                  onMouseEnter={() => setShowBlogMenu(true)}
                  onMouseLeave={() => setShowBlogMenu(false)}
                >
                  <Link to="/blog"
                    className={`nav-link d-flex align-items-center gap-1 border-0 bg-transparent ${
                      location.pathname === "/blog" ? "active" : ""
                    }`}
                  >
                    <NotebookPen size={20} strokeWidth={1.5} />
                    <span>Blog</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className={`transition ${
                        showBlogMenu ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  <div
                    className={`position-absolute end-0 mt-2 bg-light shadow-lg rounded p-4 blog-submenu ${
                      showBlogMenu ? "show" : ""
                    }`}
                    style={{
                      width: "600px",
                      top: "100%",
                      zIndex: 1000,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div className="row">
                      {blogsByCategory.map(({ category, blogs }) => (
                        <div key={category.id} className="col-md-4 mb-3">
                          <h3 className="fw-bold">{category.name}</h3>
                          <ul className="list-unstyled mt-2">
                            {blogs.map((blog) => (
                              <li key={blog.id} className="mb-2">
                                <Link
                                  to={`/blog/${blog.slug}`}
                                  className="text-decoration-none text-dark"
                                  style={{ transition: "color 0.3s" }}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.color = "#0d6efd")
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.color = "#212529")
                                  }
                                >
                                  {blog.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              </ul>

              <div className="col-lg-10 col-xl-3 d-none buttion-menu-head">
                <div className="list-inline d-flex justify-content-end ">
                  <div className="list-inline-item d-inline-block d-lg-none">
                    <button
                      className="navbar-toggler collapsed"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#navbar-default"
                      aria-controls="navbar-default"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-text-indent-left text-primary"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708zM7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        categories={categories}
      />
    </>
  );
}
