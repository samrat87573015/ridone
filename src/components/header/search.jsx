import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { getProducts } from "../../api/homeservice";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "../../api/homeservice"; // Adjust the import path as necessary
const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  // Retrieve product data, loading, and error states from Redux store
  const products = useSelector((state) => state.home.products);
  const loading = useSelector((state) => state.home.loading);
  const errorproduct = useSelector((state) => state.home.error);

  // const [searchTerm, setSearchTerm] = useState("");

  // Fetch product data when component mounts
  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      // If products are not available in the Redux store, fetch them
      if (!products || products.length === 0) {
        // await // dispatch(fetchHomeData());   // Fetch data from your Redux action
      }
    } catch (error) {
      showToast(error.message || "Failed to fetch product data", "error");
      console.error("Failed to fetch product data", error);
    } finally {
      setLoading(true);
    }
  }, [dispatch, products, showToast]);

  // Once the products are fetched, set them in local state
  useEffect(() => {
    if (products.length > 0) {
      setAllProducts(products);
    }
  }, [products]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const filtered = allProducts
      .filter((product) => {
        const searchValue = value.toLowerCase();
        return (
          product.product_name.toLowerCase().includes(searchValue) ||
          product.product_code?.toLowerCase().includes(searchValue) ||
          product.category?.name.toLowerCase().includes(searchValue) ||
          product.feature?.toLowerCase().includes(searchValue)
        );
      })
      .slice(0, 5); // Limit results to 5 for performance

    setSearchResults(filtered);
    setIsDropdownVisible(true);
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/filter?categorys=${encodeURIComponent(searchTerm)}`);
      setIsDropdownVisible(false);
    }
  };

  // Calculate discounted price
  const calculatePrice = (product) => {
    if (!product) return 0;
    const basePrice = parseFloat(product.price);
    if (product.product_campaign && product.product_campaign.length > 0) {
      const campaign = product.product_campaign?.campaign;
      const discountAmount = parseFloat(campaign.discount);
      return Math.max(basePrice - discountAmount, 0).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  // Format price display
  const formatPrice = (product) => {
    const currentPrice = calculatePrice(product);
    const hasDiscount =
      product.product_campaign && product.product_campaign.length > 0;

    return (
      <div className="d-flex align-items-center mt-1">
        <span className="text-dark fw-bold d-flex">
          <div className="signoftk">৳</div>
          {currentPrice}
        </span>
        {hasDiscount && (
          <>
            <span className="text-decoration-line-through text-muted ms-2">
              <div className="signoftk">৳</div>
              {product.price}
            </span>
            <span className="badge bg-danger ms-2">
              Save <div className="signoftk">৳</div>
              {product.product_campaign?.campaign?.discount}
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className="col-xxl-6 col-lg-5 d-none d-lg-block position-relative header-search search"
      ref={searchRef}
    >
      <form onSubmit={handleSubmit} className="position-relative">
        <div className="input-group">
          <input
            className="form-control rounded header_search_input"
            type="search"
            placeholder="Search in ride on Search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onClick={() => setIsDropdownVisible(true)}
          />
          <span className="input-group-append">
            <button
              className="btn bg-white border border-start-0 ms-n10 rounded-0 rounded-end"
              type="button"
              onClick={() => handleSearch(searchTerm)} // Call search function on click
            >
              <span>Search</span>
            </button>
          </span>
        </div>

        {/* Search Results Dropdown */}
        {isDropdownVisible && searchResults.length > 0 && (
          <div
            className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
            style={{ zIndex: 1000, maxHeight: "400px", overflowY: "auto" }}
          >
            {searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="text-decoration-none"
                onClick={() => setIsDropdownVisible(false)}
              >
                <div className="d-flex align-items-center p-3 border-bottom hover-bg-light">
                  <div className="position-relative">
                    <img
                      src={
                        product.featured_image ||
                        "assets/images/products/product-img-1.jpg"
                      }
                      alt={product.product_name}
                      className="rounded"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    {product.product_campaign && (
                      <span
                        className="position-absolute top-0 start-0 badge bg-danger"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <div className="text-dark fw-medium">
                      {product.product_name}
                    </div>
                    <div className="d-flex align-items-center mt-1">
                      <span className="badge bg-light text-dark me-2">
                        {product.category?.name}
                      </span>
                      {product.feature && (
                        <span className="badge bg-light text-dark">
                          {product.feature}
                        </span>
                      )}
                    </div>
                    {formatPrice(product)}
                    {product.quantity <= 0 && (
                      <span className="badge bg-warning text-dark mt-1">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="ms-2">
                    <i className="bi bi-chevron-right text-muted"></i>
                  </div>
                </div>
              </Link>
            ))}
            {searchResults.length === 5 && (
              <div className="p-2 text-center border-top">
                <button
                  className="btn btn-link text-decoration-none"
                  onClick={handleSubmit}
                >
                  See all results
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results Message */}
        {isDropdownVisible && searchTerm && searchResults.length === 0 && (
          <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm z-2">
            <div className="p-3 text-center">
              <i className="bi bi-search text-muted mb-2 h4"></i>
              <p className="mb-0">No products found matching "{searchTerm}"</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
