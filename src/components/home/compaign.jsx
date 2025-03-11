import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectCartError,
  clearError,
  addCartBackend
} from "../../api/store/slices/cartSlice";
import { setDirectOrder } from "../../api/store/slices/orderSlice";
import Productmodel from "../singleproduct/productmodel";

// Simple countdown timer component that matches existing design
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endDate) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="badge bg-light text-dark">
      {timeLeft.days}d : {timeLeft.hours.toString().padStart(2, '0')}h : {timeLeft.minutes.toString().padStart(2, '0')}m : {timeLeft.seconds.toString().padStart(2, '0')}s
    </div>
  );
};

export default function Campaign() {
  const error = useSelector(selectCartError);
  const [Error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, activemodal] = useState("none");
  const [ProductData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const [quantities, setQuantities] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const products = useSelector((state) => state.home.compaign?.slice(0, 6));
  const loading = useSelector((state) => state.home.loading);
  const errorproduct = useSelector((state) => state.home.error);

  // Check if we have any active campaign products
  const hasActiveCampaigns = useMemo(() => {
    return products?.some(product => 
      product.product_campaign?.campaign && 
      new Date(product.product_campaign.campaign.expiry_date) > new Date()
    );
  }, [products]);

  // If no active campaigns, don't render the section
  if (!hasActiveCampaigns) {
    return null;
  }





  // Countdown Timer Component
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endDate) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="countdown-timer bg-white bg-opacity-75 rounded px-2 py-1">
      <div className="d-flex gap-1 text-danger small fw-bold">
        <span>{timeLeft.days}d</span>:
        <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>:
        <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>:
        <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
      </div>
    </div>
  );
};




  const calculatePrice = (product) => {
    if (!product) return 0;

    const basePrice = parseFloat(product.price);
    if (product.product_campaign && product.product_campaign.campaign) {
      const campaign = product.product_campaign.campaign;
      const discountAmount = parseFloat(campaign.discount);
      return Math.max(basePrice - discountAmount, 0).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  // Keeping all your existing functions unchanged
  const getProductImages = (product) => {
    const images = [
      product.featured_image,
      product.first_image,
      product.second_image,
      product.third_image,
    ].filter((img) => img);

    return images.length > 0
      ? images
      : ["assets/images/products/product-img-1.jpg"];
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setActiveIndex(0);
    activemodal("block");
  };

  const getQuantity = (productId) => {
    return quantities[productId] || 1;
  };

  const prepareAttributes = (selectedAttributes) => {
    return Object.entries(selectedAttributes).map(([attributeName, value]) => ({
      attribute_name: attributeName,
      attribute_option_id: value.attribute_option_id,
      attribute_option: value.attribute_option,
    }));
  };

  const handleAddToCart = async (product) => {
    // Your existing handleAddToCart implementation
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + value),
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
    // Your existing CheckoutDirect implementation
  };

  function formatPrice(price) {
    const formattedPrice = parseFloat(
      price.toString().replace("Tk", "")
    ).toFixed(2); // Remove 'Tk' and ensure numeric format
    return formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3) // Remove .00 if present
      : formattedPrice;
  }
  return (
    <>
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
              <h3 className="mb-0">Campaign Product</h3>
            </div>
          </div>

          <div className="col-md-12">
            <div className="d-grid gap-5 popular-products items-list" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {products?.map((product) => (
                              <div className="single-items" key={product.id}>
                                <div className="card card-product">
                                  <div className="card-body">
                                    <div className="text-center position-relative">
                                             {/* Check for product campaign and display discount */}
  {product?.product_campaign && (
    <>
    <div className="position-absolute top-0 start-0 z-2">
      <span className="d-flex badge bg-danger">
        <div className="signoftk">Save ৳</div>
        {product.product_campaign.campaign.discount}
      </span>
      
    </div>
     <div className={`position-absolute top-0 start-0 z-2 ${product?.is_free_shipping ===1 ? 'pt-9' : 'pt-5'}`}>
     <CountdownTimer 
       endDate={product.product_campaign.campaign.expiry_date} 
     />
   </div>
    </>
  )}

  {/* Check for free shipping and display free delivery badge */}
  {product?.is_free_shipping === 1 && (
    <div className={`position-absolute top-0 start-0 z-2 ${product?.product_campaign ? 'pt-5' : 'pt-0'}`}>
      <span className="d-flex badge bg-danger">
        <div className="signoftk">Free delivery</div>
      </span>
    </div>
  )}
                                      <Link
                                        to={`/product/${product.slug}/#`}
                                        onClick={(e) => window.scrollTo(0, 0)}
                                      >
                                        <img
                                          src={
                                            product.featured_image ||
                                            "assets/images/products/product-img-1.jpg"
                                          }
                                          alt={product.product_name}
                                          className="img-fluid"
                                        />
                                      </Link>
                                      {/* <div className="card-product-action">
                                        <a
                                          href="#!"
                                          className="btn-action"
                                          onClick={(e) => handleQuickView(product)}
                                        >
                                          <i className="bi bi-eye"></i>
                                        </a>
                                        <a href="#!" className="btn-action mx-1">
                                          <i className="bi bi-heart"></i>
                                        </a>
                                        <a href="#!" className="btn-action">
                                          <i className="bi bi-arrow-left-right"></i>
                                        </a>
                                      </div> */}
                                    </div>
                                    <p className="text-start px-2">{product.product_name}</p>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="price">
                                        <span className="text-dark">
                                          <div className="signoftk">৳</div>
                                          {formatPrice(calculatePrice(product))}
                                          {product.product_campaign && (
                                            <span className="d-flex text-decoration-line-through text-muted ms-2">
                                              <div className="signoftk">৳</div>
                                              {formatPrice(product.price)}
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="add-to-cart">
                                      <button
                                        className="btn btn-primary w-100"
                                        onClick={() => handleQuickView(product)}
                                      >
                                        Add to Cart
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal - Keeping exactly as is */}
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
                  <section className="mt-8 single-product-viewpage">
                    <div className="container">
                      <div className="row">
                        <Productmodel selectedProduct={selectedProduct} />
                      </div>
                    </div>
                  </section>
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
    </>
  );
}