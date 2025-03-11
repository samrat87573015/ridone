import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { getProducts } from "../../api/homeservice";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "../../api/homeservice";
import {
  addToCart,
  selectCartError,
  clearError,
  addCartBackend,
} from "../../api/store/slices/cartSlice";
import { setDirectOrder } from "../../api/store/slices/orderSlice";
import Productmodel from "../singleproduct/productmodel";
import { addToWishlist } from "../../api/store/slices/wishlistSlice";
import { selectUser } from "../../api/store/slices/userSlice";
import ProductCard from "../product/ProductCard";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PopularProduct() {
  const error = useSelector(selectCartError);
  const [Error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, activemodal] = useState("none");
  const [ProductData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const [quantities, setQuantities] = useState({}); // Store quantities for each product
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Retrieve product data, loading, and error states from Redux store
  const products = useSelector((state) => state.home.feature?.slice(0, 6));
  const loading = useSelector((state) => state.home.loading);
  const errorproduct = useSelector((state) => state.home.error);

  //onst user = useSelector(selectUser); // Get user data from store

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
    if (product.product_campaign && product.product_campaign.campaign) {
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

  // const handleAddToWishlist = async (product_id) => {
  //     await dispatch(addToWishlist(product_id))
  // }

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
          attribute_id: parseInt(attributeId, 10),
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
          attribute_id: parseInt(attributeId, 10),
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
    <>
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
              <h3 className="mb-0">Popular Products</h3>
            </div>
          </div>

          <div className="col-12 position-relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: ".popularProducts-prev",
                nextEl: ".popularProducts-next",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
              }}
              className="popular-products-slider"
            >
              {products?.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    handleQuickView={handleQuickView}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="popularProducts-prev sliderArrowPrev"><ArrowLeft /></button>
            <button className="popularProducts-next sliderArrowNext"><ArrowRight /></button>
          </div>
        </div>
      </section>

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
