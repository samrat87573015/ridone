import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./sidebar";
import { fetchHomeData } from "../../api/homeservice";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import queryString from "query-string";
import { addCartBackend, addToCart } from "../../api/store/slices/cartSlice";
import { setDirectOrder } from "../../api/store/slices/orderSlice";
import ProductCard from "../product/ProductCard";

export default function Main() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, activemodal] = useState("none");
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Redux state
  const products = useSelector((state) => state.home.products);

  const [Error, setError] = useState("");

  const [ProductData, setProductData] = useState([]);

  const [quantities, setQuantities] = useState({}); // Store quantities for each product
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const Navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Local state
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    subcategory: null,
    attributes: {},
    priceRange: null,
  });

  const [validCategories, setValidCategories] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize valid categories when products are loaded
  useEffect(() => {
    if (products && products.length > 0) {
      const categories = new Set(products.map((p) => p.category?.slug));
      setValidCategories(categories);
      setIsInitialized(true);
    }
  }, [products]);

  // Parse filters from URL only once when products are loaded
  useEffect(() => {
    if (products && products.length > 0 && !isInitialized) {
      const queryParams = queryString.parse(location.search, {
        arrayFormat: "comma",
      });
      const categories = new Set(products.map((p) => p.category?.slug));

      // If category is invalid, redirect
      if (queryParams.category && !categories.has(queryParams.category)) {
        // showToast("Invalid category selected", "error");
        navigate("/filter", { replace: true });
        return;
      }

      setSelectedFilters({
        category: queryParams.category || null,
        subcategory: queryParams.subcategory || null,
        attributes: queryParams.attributes
          ? JSON.parse(decodeURIComponent(queryParams.attributes))
          : {},
        priceRange: queryParams.priceRange || null,
      });
    }
  }, [products, location.search, navigate, showToast, isInitialized]);

  // Fetch products only once at component mount
  useEffect(() => {
    if (
      !products ||
      products.length === 0 ||
      location.pathname.includes("/product/")
    ) {
      try {
        setLoading(true);
        dispatch(fetchHomeData())
          .catch(() => showToast("Failed to fetch product data", "error"))
          .finally(() => setLoading(false));
      } catch (error) {
        showToast(error, "error");
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, setLoading, showToast, location, products]);

  const filterProducts = useCallback(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Category filter
      if (
        selectedFilters.category &&
        product.category?.slug !== selectedFilters.category
      ) {
        return false;
      }

      // Subcategory filter
      if (
        selectedFilters.subcategory &&
        product.subcategory_id &&
        product.subcategory_id !== selectedFilters.subcategory
      ) {
        return false;
      }

      // Attributes filter with comprehensive handling
      const attributesFilter = selectedFilters.attributes;
      if (Object.keys(attributesFilter).length > 0) {
        const productAttributes = product.product_attributes || [];

        // Check each selected attribute filter
        for (const [attributeName, selectedOptionIds] of Object.entries(
          attributesFilter
        )) {
          // Find attributes matching the current attribute name
          const matchingProductAttributes = productAttributes.filter(
            (pa) =>
              pa.attribute?.name?.toLowerCase() === attributeName.toLowerCase()
          );

          // If no matching attributes found, filter out the product
          if (matchingProductAttributes.length === 0) {
            return false;
          }

          // Check if any of the product's attribute options match the selected option IDs
          const hasMatchingAttribute = matchingProductAttributes.some((pa) =>
            selectedOptionIds.includes(pa.attribute_option_id.toString())
          );

          if (!hasMatchingAttribute) {
            return false;
          }
        }
      }

      // Price range filter
      if (selectedFilters.priceRange) {
        const [min, max] = selectedFilters.priceRange.split("-").map(Number);
        const price = Number.parseFloat(product.price);
        if (price < min || price > max) return false;
      }

      return true;
    });
  }, [products, selectedFilters]);

  // Modified handleFilterChange to handle attribute filtering more robustly
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      switch (filterType) {
        case "category":
          if (!value || validCategories.has(value)) {
            newFilters.category = value;
            newFilters.subcategory = null;
          } else {
            showToast("Invalid category selected", "error");
          }
          break;
        case "subcategory":
          newFilters.subcategory = value;
          break;
        case "attribute":
          const [attributeName, optionId] = value.split("|");

          // Ensure attributes is an object
          newFilters.attributes = newFilters.attributes || {};

          // Convert to strings for consistent comparison
          const stringOptionId = optionId.toString();
          const currentAttributeOptions =
            newFilters.attributes[attributeName] || [];

          // Toggle the attribute option
          newFilters.attributes[attributeName] =
            currentAttributeOptions.includes(stringOptionId)
              ? currentAttributeOptions.filter((id) => id !== stringOptionId)
              : [...currentAttributeOptions, stringOptionId];

          // Remove the attribute if no options are selected
          if (newFilters.attributes[attributeName].length === 0) {
            delete newFilters.attributes[attributeName];
          }
          break;
        case "price":
          newFilters.priceRange = value;
          break;
        default:
          break;
      }
      return newFilters;
    });
  };

  // Updated URL handling to properly encode attribute filters
  const updateUrlWithFilters = useCallback(
    (filters) => {
      const queryParams = {
        category: filters.category || undefined,
        subcategory: filters.subcategory || undefined,
        attributes:
          filters.attributes && Object.keys(filters.attributes).length > 0
            ? encodeURIComponent(JSON.stringify(filters.attributes))
            : undefined,
        priceRange: filters.priceRange || undefined,
      };

      const searchString = queryString.stringify(queryParams, {
        arrayFormat: "comma",
        skipNull: true,
      });

      const newUrl = `/filter${searchString ? `?${searchString}` : ""}`;

      if (location.search !== `?${searchString}`) {
        navigate(newUrl, { replace: true });
      }
    },
    [navigate, location.search]
  );

  // Parse URL parameters with improved attribute handling
  useEffect(() => {
    if (products && products.length > 0) {
      const queryParams = queryString.parse(location.search, {
        arrayFormat: "comma",
        parseNumbers: false,
      });

      // Safely parse attributes
      let parsedAttributes = {};
      try {
        if (queryParams.attributes) {
          parsedAttributes = JSON.parse(
            decodeURIComponent(queryParams.attributes)
          );
        }
      } catch (error) {
        console.error("Failed to parse attributes from URL", error);
      }

      setSelectedFilters({
        category: queryParams.category || null,
        subcategory: queryParams.subcategory || null,
        attributes: parsedAttributes,
        priceRange: queryParams.priceRange || null,
      });

      setIsInitialized(true);
    }
  }, [products, location, setSelectedFilters]);

  const filteredProducts = filterProducts();

  // Function to get all product images for a product
  const getProductImages = (product) => {
    const images = [
      product.featured_image,
      product.first_image,
      product.second_image,
      product.third_image,
    ].filter((img) => img); // Filter out null/undefined images

    // If no images are available, return a default image
    return images.length > 0
      ? images
      : ["assets/images/products/product-img-1.jpg"];
  };

  // Calculate price including campaign discount (fixed amount)
  const calculatePrice = (product) => {
    if (!product) return 0;

    const basePrice = Number.parseFloat(product.price);
    if (product.product_campaign && product.product_campaign.campaign) {
      const campaign = product.product_campaign.campaign;
      const discountAmount = Number.parseFloat(campaign.discount); // Fixed discount amount
      return Math.max(basePrice - discountAmount, 0).toFixed(2); // Ensure price doesn't go below 0
    }
    return basePrice.toFixed(2);
  };

  // Handle quick view modal
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setActiveIndex(0);
    activemodal("block");
  };

  const getQuantity = (productId) => {
    return quantities[productId] || 1; // Default to 1 if quantity is not found
  };

  // Prepare attributes in the format expected by the cart system
  // Prepare attributes to match the exact JSON structure
  const prepareAttributes = (selectedAttributes) => {
    return Object.entries(selectedAttributes).map(([attributeName, value]) => ({
      attribute_name: attributeName,
      attribute_option_id: value.attribute_option_id,
      attribute_option: value.attribute_option,
    }));
  };

  const handleAddToCart = async (product) => {
    console.log(quantities);

    if (!selectedProduct && !product) {
      console.error("No product found!");
      return;
    }

    const baseProduct = selectedProduct || product;
    console.log(selectedAttributes);

    // Prepare attributes
    const attributes = prepareAttributes(selectedAttributes);

    // Prepare cart item
    const cartItem = {
      id: null, // Will be assigned by cart system
      product_id: baseProduct.id,
      quantity: getQuantity(baseProduct.id) || 1, // Default quantity
      campaign_id: baseProduct.product_campaign
        ? baseProduct.product_campaign.campaign_id
        : null,
      discount_value: baseProduct.product_campaign
        ? baseProduct.product_campaign.campaign.discount
        : null,
      product: {
        id: baseProduct.id,
        product_name: baseProduct.product_name,
        price: baseProduct.price,
        featured_image: baseProduct.featured_image,
      },
      attribute_values: Object.values(selectedAttributes).map(
        (data) => data.attributeOptionId
      ),
      selectedAttributes: Object.entries(selectedAttributes).map(
        ([attributeId, data]) => ({
          attribute_id: Number.parseInt(attributeId, 10),
          attribute_option_id: data.attributeOptionId,
          attribute_name: data.attributeName,
          attribute_option: data.optionName,
        })
      ),
    };

    console.log("Add to Cart Payload:", cartItem);

    try {
      // Attempt to sync with backend
      const result = await dispatch(addCartBackend(cartItem)).unwrap();

      // Dispatch the action to add the item to Redux state only if backend sync is successful
      dispatch(addToCart(cartItem));
      console.log("Cart synced successfully with backend:", result);

      // Clear selections after successful addition
      if (selectedProduct) {
        setSelectedProduct(null);
        setSelectedAttributes({});
        setQuantities({});
        activemodal("none");
      }
    } catch (error) {
      // Handle errors during backend sync
      console.error("Failed to sync cart:", error);
      showToast(error, "error");
      setError(error, "error");
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + value), // Ensure quantity is at least 1
    }));
  };

  const handleAttributeSelect = (
    attributeId,
    attributeOptionId,
    optionName,
    attributeName
  ) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: {
        attributeOptionId,
        optionName,
        attributeName,
      },
    }));
  };

  const CheckoutDirect = (product) => {
    if (!selectedProduct && !product) {
      console.error("No product found!");
      return;
    }

    const baseProduct = selectedProduct || product;

    // Prepare cart item
    const items = {
      id: null, // Will be assigned by cart system
      product_id: baseProduct.id,
      quantity: getQuantity(baseProduct.id) || 1, // Default quantity
      campaign_id: baseProduct.product_campaign
        ? baseProduct.product_campaign.campaign_id
        : null,
      discount_value: baseProduct.product_campaign
        ? baseProduct.product_campaign.campaign.discount
        : null,
      product: {
        id: baseProduct.id,
        product_name: baseProduct.product_name,
        price: baseProduct.price,
        featured_image: baseProduct.featured_image,
      },
      attribute_values: Object.values(selectedAttributes).map(
        (data) => data.attributeOptionId
      ),
      attributes: Object.entries(selectedAttributes).map(
        ([attributeId, data]) => ({
          attribute_id: Number.parseInt(attributeId, 10),
          attribute_option_id: data.attributeOptionId,
          attribute_name: data.attributeName,
          attribute_option: data.optionName,
        })
      ),
    };

    dispatch(setDirectOrder(items));
    Navigate("/checkout");
  };

  function formatPrice(price) {
    const formattedPrice = parseFloat(
      price.toString().replace("Tk", "")
    ).toFixed(2); // Remove 'Tk' and ensure numeric format
    return formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3) // Remove .00 if present
      : formattedPrice;
  }

  function formatPreviousPrice(price) {
    const formattedPrice = parseFloat(
      price.toString().replace("Tk", "")
    ).toFixed(2); // Remove 'Tk' and ensure numeric format
    return formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3) // Remove .00 if present
      : formattedPrice;
  }

  return (
    <main>
      {/* <div className="mt-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  {selectedFilters.category && (
                    <li className="breadcrumb-item active">
                      {selectedFilters.category}
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div> */}

      <div className="mt-8 mb-lg-14 mb-8">
        <div className="container">
          <div className="row gx-10">
            <Sidebar
              products={products}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
            <section className="col-lg-9 col-md-12">
              <div className="card mb-4 bg-light border-0">
                <div className="card-body p-9">
                  <h2 className="mb-0 fs-1">
                    {selectedFilters.category || "All Products"}
                  </h2>
                </div>
              </div>
              <div>
                {filteredProducts.length > 0 ? (
                  <div
                    className="d-grid gap-5 filter-page popular-products items-list"
                    // style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard
                      product={product}
                      handleQuickView={handleQuickView}
                    />
                    ))}
                  </div>
                ) : (
                  <div className="col-12">
                    <p className="text-center fs-4">
                      No products found. Browse more!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}

      <div
        className="modal fade show"
        style={{ display: modal }}
        id="quickViewModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-8">
              {selectedProduct && (
                <>
                  <div
                    className="position-absolute top-0 end-0 me-3 mt-3"
                    onClick={() => activemodal("none")}
                  >
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      {/* Main Product Image Display */}
                      <div className="product productModal" id="productModal">
                        <div
                          className="zoom"
                          style={{
                            backgroundImage: `url(${
                              getProductImages(selectedProduct)[activeIndex]
                            })`,
                          }}
                        >
                          <img
                            src={
                              getProductImages(selectedProduct)[activeIndex] ||
                              "/placeholder.svg"
                            }
                            alt={selectedProduct.product_name}
                            className="ratio"
                          />
                        </div>
                      </div>

                      {/* Thumbnail Section */}
                      <div className="product-tools">
                        <div
                          className="thumbnails row g-3"
                          id="productModalThumbnails"
                        >
                          {getProductImages(selectedProduct).map(
                            (image, index) => (
                              <div
                                key={index}
                                className={`col-3 ${
                                  index === activeIndex ? "tns-nav-active" : ""
                                }`}
                                onClick={() => setActiveIndex(index)}
                              >
                                <div className="thumbnails-img">
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`${selectedProduct.product_name} ${
                                      index + 1
                                    }`}
                                    className="ratio"
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="ps-lg-8 mt-6 mt-md-0">
                        <div className="col-md-12 row">
                          <div className="col-md-8">
                            <a href="#!" className="mb-4 d-block">
                              {selectedProduct?.category?.name}
                            </a>
                          </div>
                        </div>

                        <h1 className="mb-1">{selectedProduct.product_name}</h1>

                        <div className="fs-4">
                          <span className="fw-bold text-dark">
                            ${calculatePrice(selectedProduct)}
                          </span>
                          {selectedProduct.product_campaign && (
                            <>
                              <span className="text-decoration-line-through text-muted">
                                ${selectedProduct.price}
                              </span>
                              <span>
                                <small className="fs-6 ms-2 text-danger">
                                  Save{" "}
                                  {
                                    selectedProduct.product_campaign.campaign
                                      .discount
                                  }
                                </small>
                              </span>
                            </>
                          )}
                        </div>
                        {/* <hr className="my-6" />
                        <div>
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td>Product Code:</td>
                                <td>{selectedProduct.product_code}</td>
                              </tr>
                              <tr>
                                <td>Availability:</td>
                                <td>
                                  {selectedProduct.quantity > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </td>
                              </tr>
                              <tr>
                                <td>Type:</td>
                                <td>{selectedProduct.feature}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div> */}
                        <hr className="my-6" />
                        <div className="mt-5">
                          {selectedProduct.product_attributes &&
                          selectedProduct.product_attributes.length > 0 ? (
                            // Group product attributes by attribute_id to ensure unique attributes
                            Object.values(
                              selectedProduct.product_attributes.reduce(
                                (acc, attribute) => {
                                  // Check if this attribute_id already exists in the accumulator
                                  if (!acc[attribute.attribute_id]) {
                                    acc[attribute.attribute_id] = {
                                      ...attribute,
                                      options: [],
                                    };
                                  }
                                  // Add unique attribute options to the corresponding attribute group
                                  if (attribute.attribute_option) {
                                    const isOptionUnique = acc[
                                      attribute.attribute_id
                                    ].options.every(
                                      (opt) =>
                                        opt.id !== attribute.attribute_option.id
                                    );
                                    if (isOptionUnique) {
                                      acc[attribute.attribute_id].options.push(
                                        attribute.attribute_option
                                      );
                                    }
                                  }
                                  return acc;
                                },
                                {}
                              )
                            ).map((attribute) => (
                              <div
                                key={attribute.attribute_id}
                                className="mb-3"
                              >
                                <label className="form-label">
                                  {attribute.attribute?.name || "Attribute"}:
                                </label>
                                <div>
                                  {attribute.options &&
                                  attribute.options.length > 0 ? (
                                    attribute.options.map((option) => (
                                      <button
                                        key={option.id}
                                        type="button"
                                        className={`btn btn-outline-secondary m-1 ${
                                          selectedAttributes[
                                            attribute.attribute_id
                                          ]?.attributeOptionId === option.id
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleAttributeSelect(
                                            attribute.attribute_id,
                                            option.id,
                                            option.name,
                                            attribute.attribute.name
                                          )
                                        }
                                      >
                                        {option.name}
                                      </button>
                                    ))
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary m-1 disabled"
                                    >
                                      No options available
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No attributes available</p>
                          )}
                        </div>
                        <div className="text-danger">{Error}</div>

                        <div>
                          <div className="input-group input-spinner mt-4 w-30">
                            <button
                              type="button"
                              className="button-minus btn btn-sm"
                              onClick={() =>
                                handleQuantityChange(selectedProduct.id, -1)
                              }
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="quantity-field form-control-sm form-input"
                              value={quantities[selectedProduct.id] || 1} // Default to 1 if not set
                              readOnly
                            />
                            <button
                              type="button"
                              className="button-plus btn btn-sm"
                              onClick={() =>
                                handleQuantityChange(selectedProduct.id, 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="mt-5">
                          <div className="row">
                            <div className="col-xxl-6 col-lg-6 col-md-6 col-6 d-grid">
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                  background: "#CD6727",
                                  borderColor: "#CD6727",
                                }}
                                onClick={handleAddToCart}
                              >
                                <i className="feather-icon icon-shopping-bag me-2"></i>
                                Add to cart
                              </button>
                            </div>
                            <div className="col-xxl-6 col-lg-6 col-md-6 col-6 d-grid">
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                  background: "black",
                                  borderColor: "black",
                                }}
                                onClick={CheckoutDirect}
                              >
                                <i className="feather-icon icon-shopping-bag me-2"></i>
                                Order Now
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5">
                          <div className="row">
                            <div className="col-12 mb-3">
                              <button
                                type="button"
                                className="btn btn-primary w-100"
                              >
                                <i className="feather-icon icon-phone me-2"></i>
                                Call Now
                              </button>
                            </div>
                            <div className="col-12">
                              <button
                                type="button"
                                className="btn btn-primary w-100"
                              >
                                <i className="bi bi-whatsapp me-2"></i>
                                WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        style={{ display: modal }}
      ></div>
    </main>
  );
}
