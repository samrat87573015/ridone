"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, addCartBackend } from "../../api/store/slices/cartSlice";
import { setDirectOrder } from "../../api/store/slices/orderSlice";
import Productmodel from "../singleproduct/productmodel";
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

const CategoryBasedProducts = () => {
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const [groupedProducts, setGroupedProducts] = useState({});

  // Get products and categories from Redux store
  const products = useSelector((state) => state.home.products);
  const categories = useSelector((state) => state.home.categories);
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  const [activeIndex, setActiveIndex] = useState(0);
  const [Error, setError] = useState("");
  const [modal, activemodal] = useState("none");
  const [ProductData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({}); // Store quantities for each product
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const Navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const errorproduct = useSelector((state) => state.home.error);

  // Group products by category
  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      const grouped = categories.reduce((acc, category) => {
        acc[category.id] = products
          .filter((product) => product.category_id === category.id)
          .slice(0, 8); // Limit to 8 products per category
        return acc;
      }, {});
      setGroupedProducts(grouped);
    }
  }, [products, categories]);

  // Show error toast if there is an error fetching data
  useEffect(() => {
    if (errorproduct) {
      showToast(errorproduct, "error");
    }
  }, [errorproduct, showToast]);

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
  const prepareAttributes = (selectedAttributes) => {
    return Object.entries(selectedAttributes).map(([attributeName, value]) => ({
      attribute_name: attributeName,
      attribute_option_id: value.attribute_option_id,
      attribute_option: value.attribute_option,
    }));
  };

  // Updated handleAddToCart function
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

  if (loading) {
    return (
      <div className="container text-center py-8">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  function formatPrice(price) {
    const formattedPrice = Number.parseFloat(
      price.toString().replace("Tk", "")
    ).toFixed(2); // Remove 'Tk' and ensure numeric format
    return formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3) // Remove .00 if present
      : formattedPrice;
  }

  function formatPreviousPrice(price) {
    const formattedPrice = Number.parseFloat(
      price.toString().replace("Tk", "")
    ).toFixed(2); // Remove 'Tk' and ensure numeric format
    return formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3) // Remove .00 if present
      : formattedPrice;
  }

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      {categories.map((category) => {
        const categoryProducts = (groupedProducts[category.id] || []).slice(
          0,
          8
        );

        if (categoryProducts.length === 0) return null;

        return (
          <div key={category.id} className="mb-5 pt-5">
            <div className="col-md-12 row productbaseofctg">
              <div className="col-md-12">
                <div key={category.id} className="col single-item">
                  <div className="m-auto">
                    <div className="ctg-img">
                      <img
                        src={category?.image || "/placeholder.svg"}
                        alt={category?.name}
                        className="img-fluid"
                      />
                    </div>
                    <div className="position-relative ctg-name text-center">
                      <span>{category?.name}</span>
                    </div>
                  </div>
                  <Link
                    to={`/filter?category=${category.slug}`}
                    className="text-decoration-none text-reset"
                  >
                    View More
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="col-md-12 position-relative">
                {/* Swiper Slider Implementation */}
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={{
                    prevEl: ".catagorybaseProduct-prev",
                    nextEl: ".catagorybaseProduct-next",
                  }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    0: {
                      slidesPerView: 2,
                    },
                    576: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    992: {
                      slidesPerView: 4,
                    },
                  }}
                  className="product-slider"
                >
                  {categoryProducts?.map((product) => (
                    <SwiperSlide key={product.id}>
                      <ProductCard
                        product={product}
                        handleQuickView={handleQuickView}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="catagorybaseProduct-prev sliderArrowPrev"><ArrowLeft /></button>
                <button className="catagorybaseProduct-next sliderArrowNext"><ArrowRight /></button>
              </div>
            </div>
          </div>
        );
      })}

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
    </div>
  );
};

export default CategoryBasedProducts;
