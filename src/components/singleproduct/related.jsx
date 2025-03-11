import React, { useEffect, useState, useCallback } from "react";
import { Await, Link } from "react-router-dom";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { getProducts } from "../../api/homeservice";
import { useDispatch } from "react-redux";
import {
  addToCart,
  syncCart,
  removeFromCart,
  selectCartError,
  clearError,
  addCartBackend,
} from "../../api/store/slices/cartSlice";
import { useSelector } from "react-redux";
export default function Related({ ProductData }) {
  const error = useSelector(selectCartError);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, activemodal] = useState("none");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const [quantities, setQuantities] = useState({}); // Store quantities for each product
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  let ProductDatas = [];
  try {
    ProductDatas = ProductData;
  } catch (error) {
    console.error("Failed to parse specifications:", error);
  }

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

    const basePrice = parseFloat(product.price);
    if (product.product_campaign && product.product_campaign.length > 0) {
      const campaign = product.product_campaign.campaign;
      const discountAmount = parseFloat(campaign.discount); // Fixed discount amount
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

  // Updated handleAddToCart function
  const handleAddToCart = (product) => {
    console.log(quantities);

    if (!selectedProduct && !product) {
      console.error("No product found!");
      return;
    }

    const baseProduct = selectedProduct || product;
    console.log(selectedAttributes);

    // Prepare attributes
    const attributes = prepareAttributes(selectedAttributes);

    const attribute_values = Object.entries(selectedAttributes).map(
      (attr) => attr.attribute_option_id
    );
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
          attribute_id: parseInt(attributeId, 10),
          attribute_option_id: data.attributeOptionId,
          attribute_name: data.attributeName,
          attribute_option: data.optionName,
        })
      ),
    };
    console.log("Add to Cart Payload:", cartItem);
    // Dispatch actions for adding to cart and syncing

    dispatch(addCartBackend(cartItem)).catch((error) => {
      alert("Failed to sync cart. Please try again.");
      console.error(error);
    });
    // dispatch(syncCart({ items: cartItem })).catch((error) => {
    //   alert("Failed to sync cart. Please try again.");
    //   console.error(error);
    // });

    dispatch(addToCart(cartItem));
    // Show error if present
    if (error) {
      console.error(error);
      dispatch(clearError());
    }

    if (selectedProduct) {
      setSelectedProduct(null);
      setSelectedAttributes({});
      setQuantities({});
      activemodal("none");
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

  return (
    <section className="my-lg-14 my-14">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3>Related Product</h3>
          </div>
        </div>

        {/* <div className="row g-4 row-cols-lg-5 row-cols-2 row-cols-md-2 mt-2">
       


          {(ProductDatas && ProductDatas.length > 0) ? (
            ProductDatas?.map((product) => (
               <div className="col" key={product.id}>
                 <div className="card card-product">
                   <div className="card-body">
                     <div className="text-center position-relative">
                       {product?.product_campaign && (
                         <div className="position-absolute top-0 start-0">
                           <span className="badge bg-danger">
                             Save {product.product_campaign.campaign.discount}
                           </span>
                         </div>
                       )}
                       <Link to={`/product/${product.slug}`}>
                         <img
                           src={
                             product.featured_image ||
                             "assets/images/products/product-img-1.jpg"
                           }
                           alt={product.product_name}
                           className="mb-3 img-fluid ratio"
                         />
                       </Link>
   
                       <div className="card-product-action">
                         <a
                           href="#!"
                           className="btn-action"
                           onClick={() => handleQuickView(product)}
                         >
                           <i className="bi bi-eye"></i>
                         </a>
                         <a href="#!" className="btn-action mx-1">
                           <i className="bi bi-heart"></i>
                         </a>
                         <a href="#!" className="btn-action">
                           <i className="bi bi-arrow-left-right"></i>
                         </a>
                       </div>
                     </div>
                     <div className="text-small mb-1">
                       <a href="#!" className="text-decoration-none text-muted">
                         <small>{product?.category?.name}</small>
                       </a>
                     </div>
                     <h2 className="fs-6">
                       <Link
                         to={`/product/${product.slug}`}
                         className="text-inherit text-decoration-none"
                       >
                         {product.product_name}
                       </Link>
                     </h2>
                     <div>
                       <small className="text-warning">
                         <i className="bi bi-star-fill"></i>
                         <i className="bi bi-star-fill"></i>
                         <i className="bi bi-star-fill"></i>
                         <i className="bi bi-star-fill"></i>
                         <i className="bi bi-star-half"></i>
                       </small>
                       <span className="text-muted small">4.5(149)</span>
                     </div>
                     <div className="d-flex justify-content-between align-items-center mt-3">
                       <div>
                         <span className="text-dark">
                           ${calculatePrice(product)}
                         </span>
                         {product.product_campaign && (
                           <span className="text-decoration-line-through text-muted ms-2">
                             ${product.price}
                           </span>
                         )}
                       </div>
                       <div>
                         <button
                           className="btn btn-primary btn-sm"
                           onClick={(e) => {
                             handleAddToCart(product);
                           }}
                         >
                           <svg
                             xmlns="http://www.w3.org/2000/svg"
                             width="16"
                             height="16"
                             viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             className="feather feather-plus"
                           >
                             <line x1="12" y1="5" x2="12" y2="19"></line>
                             <line x1="5" y1="12" x2="19" y2="12"></line>
                           </svg>
                           Add
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             ))
          ) : (
            <p>No related products found.</p>
          )}
        </div> */}

        <div className="col-md-12">
          <div
            className="d-grid gap-5 popular-products items-list"
            style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
          >
            {ProductDatas && ProductDatas.length > 0 ? (
              ProductDatas?.map((product) => (
                <div className="single-items" key={product.id}>
                  <div className="card card-product">
                    <div className="card-body">
                      <div className="text-center position-relative">
                        {product?.product_campaign && (
                          <div className="position-absolute top-0 start-0">
                            <span className="badge bg-danger">
                              Save {product.product_campaign.campaign.discount}
                            </span>
                          </div>
                        )}
                        <Link to={`/product/${product.slug}`} onClick={(e) => window.scrollTo(0, 0)}> 
                          <img
                            src={
                              product.featured_image ||
                              "assets/images/products/product-img-1.jpg"
                            }
                            alt={product.product_name}
                            className="img-fluid ratio"
                          />
                        </Link>
                        {/* <div className="card-product-action">
                          <a
                            href="?#"
                            className="btn-action"
                            onClick={(e) => handleQuickView(product)}
                          >
                            <i className="bi bi-eye"></i>
                          </a>
                          <a href="?#" className="btn-action mx-1">
                            <i className="bi bi-heart"></i>
                          </a>
                          <a href="?#" className="btn-action">
                            <i className="bi bi-arrow-left-right"></i>
                          </a>
                        </div> */}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="price">
                          <span className="text-dark">
                            ৳{calculatePrice(product)}
                            {product.product_campaign && (
                              <span className="text-decoration-line-through text-muted ms-2">
                                ৳{product.price}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No related products found.</p>
            )}
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
                            src={getProductImages(selectedProduct)[activeIndex]}
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
                                    src={image}
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
                          <div className="col-md-4">
                            <a
                              className="btn btn-light"
                              href="#"
                              data-bs-toggle="tooltip"
                              data-bs-html="true"
                              aria-label="Compare"
                            >
                              <i className="bi bi-arrow-left-right"></i>
                            </a>
                            <a
                              className="btn btn-light mx-2"
                              href="#"
                              data-bs-toggle="tooltip"
                              data-bs-html="true"
                              aria-label="Wishlist"
                            >
                              <i className="feather-icon icon-heart"></i>
                            </a>
                          </div>
                        </div>

                        <h1 className="mb-1">{selectedProduct.product_name}</h1>
                        <div className="mb-4">
                          <small className="text-warning">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-half"></i>
                          </small>
                          <a href="#" className="ms-2">
                            (0 reviews)
                          </a>
                        </div>
                        <div className="fs-4">
                          <span className="fw-bold text-dark">
                            ৳{calculatePrice(selectedProduct)}
                          </span>
                          {selectedProduct.product_campaign && (
                            <>
                              <span className="text-decoration-line-through text-muted">
                                ৳{selectedProduct.price}
                              </span>
                              <span>
                                <small className="fs-6 ms-2 text-danger">
                                  {
                                    selectedProduct.product_campaign.campaign
                                      .discount
                                  }
                                  % Off
                                </small>
                              </span>
                            </>
                          )}
                        </div>
                        <hr className="my-6" />
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
                        </div>
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
    </section>
  );
}
