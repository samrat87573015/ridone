import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLoading } from "../LoadingContext"; // Adjust the import path
import { useToast } from "../ToastContext";
import { getCategorys } from "../../api/homeservice"; // Adjust the import path as necessary
import Headercart from "./headercart";
import Search from "./search";
import { setActiveCart } from "../../api/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { fetchHomeData } from "../../api/homeservice";
import SidebarButton from "./SidebarButton";
import Sidemenu from "./sidemenu";
import MobileSidebar from "./MobileSidebar";
import { Headset, ShoppingCart, User } from "lucide-react";
export default function Middle() {
  const [Locationmodal, activeLocationmodal] = useState("none");
  const [userModal, activeuserModal] = useState("none");
  const [cartList, activecartList] = useState(0);
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.user);
  const { activecart, selectCartTotal, items } = useSelector(
    (state) => state.cart
  );
  const [cartCount, setcartCount] = useState(items.length || 0);
  const dispatch = useDispatch();

  // Get categories from Redux store
  const categories = useSelector((state) => state.home.categories);
  const siteinfos = useSelector((state) => state.home?.siteinfos[0]);
  const media = useSelector((state) => state.home?.siteinfos?.media || []);
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  // Filtered categories based on the search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeCartSection = () => {
    dispatch(setActiveCart(false));
  };
  const addCartSection = () => {
    dispatch(setActiveCart(true));
  };

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="pt-5 header-middle">
        <div className="container">
          <div className="row w-100 align-items-center gx-0 justify-content-between">
            <div className="col-xxl-2 col-lg-1 col-md-2 col-5 logo">
              <Link className="navbar-brand d-none d-lg-block" to="/">
                <img
                  src={
                    media[0]?.logo ??
                    ""
                  }
                  alt={siteinfos?.app_name ?? ""}
                />
              </Link>
              <div className="d-flex justify-content-between w-100 d-lg-none">
                <Link className="navbar-brand" to="/">
                  <img
                    src={
                      media[0]?.logo ??
                      ""
                    }
                    alt={siteinfos?.app_name ?? ""}
                  />
                </Link>
              </div>
            </div>

            <Search />
            <div className="col-lg-4 col-6 d-flex header_icon_area gap-8 align-items-center justify-content-end">
              <div className="cart_icon_area d-none d-lg-block">
                <div className="cursor-pointer" onClick={addCartSection}>
                  <span className="cart_count position-absolute top-0 right-0 translate-middle badge rounded-pill">{cartCount}</span>
                  <ShoppingCart onClick={addCartSection} />
                </div>
              </div>

              <div className="d-flex d-none d-lg-flex support_area">
                <div className="image ">
                  <div className="d-flex align-items-center gap-2">
                    <Headset />
                    <span className="mb-0">Support</span>
                  </div>
                  <span className="mb-0">+880 1234567890</span>
                </div>
              </div>

              <div className="list-inline-item loginBtn me-5">
                {isAuthenticated ? (
                  <Link to="/account-orders" className="text-muted">
                    <label className="ms-2 loginBtn d-none d-lg-block">Account</label>
                    <label className="ms-2 loginBtn d-lg-none"><User size={20} strokeWidth={1.5} /></label>
                  </Link>
                  
                ) : (
                  <Link
                    to="/signin"
                    className="text-muted"
                    data-bs-toggle="modal"
                    data-bs-target="#userModal"
                  >
                    <label className="ms-2 loginBtn d-none d-lg-block">Login/Register</label>
                    <label className="ms-2 loginBtn d-lg-none"><User size={20} strokeWidth={1.5} /></label>
                  </Link>
                )}
              </div>

              <div className="d-flex d-lg-none">
                <SidebarButton onOpen={() => setShowSidebar(true)} />
              </div>
            </div>
            {/* <div className="col-md-2 col-xxl-3 d-none d-lg-block">
              <button
                type="button"
                className="btn btn-outline-gray-400 text-muted"
                data-bs-toggle="modal"
                data-bs-target="#locationModal"
                onClick={(e) => activeLocationmodal("block")}
              >
                <i className="bi bi-collection mx-1"></i>
                All Categorys
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div
        className={`offcanvas offcanvas-end ${
          cartList === 1 || activecart ? "show" : ""
        }`}
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <Headercart />
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={removeCartSection}
        style={{ display: cartList === 1 || activecart ? "block" : "none" }}
      ></div>
      <div
        className="modal fade show"
        style={{ display: Locationmodal }}
        id="locationModal"
        aria-labelledby="locationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-6">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1" id="locationModalLabel">
                    Choose your Delivery Location
                  </h5>
                  <p className="mb-0 small">
                    Enter your address and we will specify the offer you area.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={(e) => activeLocationmodal("none")}
                ></button>
              </div>
              <div className="my-5">
                {/* Search Input */}
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search categories"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
                <div className="mt-5">
                  <div
                    data-simplebar
                    style={{
                      height: "300px",
                      overflow: "hidden",
                      overflowY: "scroll",
                    }}
                  >
                    <div className="list-group list-group-flush">
                      {filteredCategories.map((category, index) => (
                        <Link
                          key={index}
                          to={"/product/" + category.slug}
                          className={`list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <span>
                            <img
                              src={category.image || "placeholder-image-url"} // Replace with a fallback URL if necessary
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
                      ))}
                      {filteredCategories.length === 0 && (
                        <div className="text-center text-muted mt-3">
                          No categories found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ display: Locationmodal }}
      ></div>
      <div
        className="modal-backdrop fade show"
        style={{ display: userModal }}
      ></div>
      <div
        className="modal-backdrop fade show "
        style={{ display: cartList === 1 ? "block" : "none" }}
      ></div>

      {/* <Sidemenu /> */}

      <MobileSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        categories={categories}
      />
    </>
  );
}
