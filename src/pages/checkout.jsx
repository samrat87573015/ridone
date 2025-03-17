"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createOrder,
  setDelivaryCost,
  checkcoupon,
  informations,
  setDirectOrder,
  resetCoupon,
} from "../api/store/slices/orderSlice";
import { fetchAddresses, getUserData } from "../api/store/slices/userSlice";
import { fetchCartData, generateGuestId } from "../api/store/slices/cartSlice";
import { useToast } from "../components/ToastContext";
// import { dataLayer } from "../components/EcommerceDataLayerService"
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Checkout() {
  const guestId = generateGuestId();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  // Redux state
  const {
    isDirectOrder,
    directOrderItems,
    sitedata,
    deliveryCharge = 0,
    couponResponse = null,
  } = useSelector((state) => state.order);
  const { user, addresses } = useSelector((state) => state.user || {});
  const { items: cartItems = [], total: cartTotal = 0 } = useSelector(
    (state) => state.cart || {}
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    alternativePhone: "",
    note: "",
    area: "",
    id: user ? user.id : guestId,
    paymentType: "cashon",
    payment_status: "Pending",
  });

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    address: "",
    phone: "",
    area: "",
    paymentType: "",
  });

  // Order state
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [DelivaryCharge, setDelivaryCharge] = useState("none");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Determine which items to display
  const displayedItems = isDirectOrder
    ? Array.isArray(directOrderItems)
      ? directOrderItems
      : [directOrderItems]
    : Array.isArray(cartItems)
    ? cartItems
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          await dispatch(fetchAddresses()).unwrap();
        } else {
          await dispatch(getUserData()).unwrap();
          await dispatch(fetchAddresses()).unwrap();
        }
      } catch (err) {
        showToast("Failed to fetch user data or addresses", "error");
      }
    };

    fetchData();

    if (isDirectOrder) {
      dispatch(setDirectOrder(directOrderItems));
    } else {
      dispatch(fetchCartData());
    }

    dispatch(informations());

    const items = isDirectOrder ? directOrderItems : cartItems;
    // dataLayer.trackDirectCheckout(items)
  }, [user, dispatch, showToast, isDirectOrder, directOrderItems]);

  useEffect(() => {
    if (couponResponse && couponResponse.success) {
      setCouponApplied(true);
      console.log("Coupon applied from Redux state:", couponResponse);
    }
  }, [couponResponse]);

  useEffect(() => {
    return () => {
      // Cleanup: Reset coupon state when the component unmounts
      handleResetCoupon();
    };
  }, []);

  // Form validation functions
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return !value ? "Name is required" : "";
      case "phone":
        return !value
          ? "Phone is required"
          : !/^\d{10,15}$/.test(value)
          ? "Please enter a valid 11-15 digit phone number"
          : "";
      case "address":
        return !value ? "Address is required" : "";
      case "area":
        return !value ? "Area selection is required" : "";
      case "paymentType":
        return !value ? "Payment type is required" : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(fieldErrors).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setFieldErrors(newErrors);
    return isValid;
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      payment_status:
        name === "paymentType"
          ? value === "bkash"
            ? "completed"
            : "Pending"
          : prev.payment_status,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "area") {
      const charge =
        value === "inside"
          ? Number(sitedata?.shipping_charge_inside_dhaka)
          : value === "outside"
          ? Number(sitedata?.shipping_charge_outside_dhaka)
          : "none";

      setDelivaryCharge(charge);
      dispatch(setDelivaryCost(charge));
    }
  };

  const handleSaveIncompleteOrder = async () => {
    try {
      const items = isDirectOrder ? directOrderItems : cartItems;
      const response = await dispatch(
        createOrder({
          items,
          isDirectOrder,
          userDetails: formData,
          Delivary_charge: DelivaryCharge,
          Order_status: "incomplete",
        })
      ).unwrap();

      console.log(response);
    } catch (error) {
      showToast("Failed to save draft order", "error");
    }
  };

  const handleResetCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    dispatch(resetCoupon()); // Dispatch the Redux action to reset coupon state
    localStorage.removeItem("appliedCouponProductIds");
    localStorage.removeItem("appliedCouponCode");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const items = isDirectOrder ? directOrderItems : cartItems;

    if (!items || items.length === 0) {
      showToast("No items in cart", "error");
      setLoading(false);
      return;
    }

    try {
      //const callbackURL = "http://localhost:3000/payment/success/";
      const { couponDiscount: totalCouponDiscount } = calculateTotal();

      const orderPayload = {
        items: items.map((item) => {
          const itemDetails = calculateItemDetails(item);
          return {
            ...item,
            coupon_discount: itemDetails.itemCouponDiscount || 0,
          };
        }),
        isDirectOrder,
        userDetails: {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          alternativePhone: formData.alternativePhone,
          note: formData.note,
          area: formData.area,
          paymentType: formData.paymentType,
          payment_status:
            formData.paymentType === "bkash" ? "completed" : "Pending",
          shippingPrice: DelivaryCharge || 0,
        },
        Delivary_charge: DelivaryCharge || 0,
        Order_status: "pending",
        total_coupon_discount: totalCouponDiscount || 0,
      };

      const response = await dispatch(createOrder(orderPayload)).unwrap();

      // Reset coupon after successful order placement
      handleResetCoupon();

      // if (formData.paymentType === "bkash") {
      //   console.log(response);
      //   const bkashURL = response.bkashURL || response.data?.bkashURL;
      //   if (bkashURL) {
      //     window.location.href = bkashURL;
      //     return;
      //   } else {
      //     throw new Error("bKash URL not found in response");
      //   }
      // }

      showToast("Order placed successfully", "success");
      Navigate(
        `/checkout/success/${response.invoice_number || response.order_id}`
      );
    } catch (err) {
      showToast(err.message || "Failed to process order", "error");
    } finally {
      setLoading(false);
    }
  };

  // Order calculation functions (unchanged)
  const calculateItemDetails = (item) => {
    const basePrice = Number.parseFloat(item.product.price || 0);
    const quantity = item.quantity || 0;
    const itemTotal = basePrice * quantity;
    const campaignDiscount = item.discount_value
      ? Number.parseFloat(item.discount_value) * quantity
      : 0;

    let itemCouponDiscount = 0;
    if (couponApplied && couponResponse && couponResponse.success) {
      if (couponResponse.success.discount_type === "percentage") {
        const discountPercentage = Number.parseFloat(
          couponResponse.success.discount_amount || 0
        );
        itemCouponDiscount =
          (itemTotal - campaignDiscount) * (discountPercentage / 100);
      } else if (couponResponse.success.discount_type === "fixed") {
        const totalBeforeDiscount =
          calculateSubtotal() -
          displayedItems.reduce(
            (sum, i) =>
              sum +
              Number.parseFloat(i.discount_value || 0) * (i.quantity || 0),
            0
          );
        const itemProportion =
          (itemTotal - campaignDiscount) / totalBeforeDiscount;
        itemCouponDiscount =
          Number.parseFloat(couponResponse.success.discount_amount || 0) *
          itemProportion;
      } else if (couponResponse.product_discounts) {
        const productDiscount = couponResponse.product_discounts.find(
          (discount) => discount.product_id === item.product.id
        );
        if (productDiscount) {
          const perItemCouponDiscount = Number.parseFloat(
            productDiscount.discount_amount || 0
          );
          itemCouponDiscount = perItemCouponDiscount * quantity;
        }
      }
    }

    const finalItemPrice = itemTotal - campaignDiscount - itemCouponDiscount;

    return {
      basePrice,
      quantity,
      itemTotal,
      campaignDiscount,
      itemCouponDiscount,
      finalItemPrice,
    };
  };

  const calculateSubtotal = () => {
    return Array.isArray(displayedItems)
      ? displayedItems.reduce(
          (sum, item) =>
            sum +
            Number.parseFloat(item.product.price || 0) * (item.quantity || 0),
          0
        )
      : 0;
  };

  const calculateDeliveryCharge = () => {
    const originalDeliveryCharge = deliveryCharge || 0;
    if (!displayedItems.length || originalDeliveryCharge === 0) return 0;

    const freeDeliveryProducts = displayedItems.filter(
      (item) => item.product.free_delivery === 1
    );
    if (freeDeliveryProducts.length === displayedItems.length) return 0;

    const freeDeliveryProductsTotal = freeDeliveryProducts.reduce(
      (sum, item) =>
        sum + Number.parseFloat(item.product.price || 0) * (item.quantity || 0),
      0
    );
    const paidDeliveryProductsTotal =
      displayedItems.reduce(
        (sum, item) =>
          sum +
          Number.parseFloat(item.product.price || 0) * (item.quantity || 0),
        0
      ) - freeDeliveryProductsTotal;

    if (paidDeliveryProductsTotal <= 0) return 0;

    const deliveryChargeRatio =
      paidDeliveryProductsTotal /
      (freeDeliveryProductsTotal + paidDeliveryProductsTotal);
    const adjustedDeliveryCharge = originalDeliveryCharge * deliveryChargeRatio;

    return Math.max(0, adjustedDeliveryCharge);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const totalCampaignDiscount = displayedItems.reduce(
      (sum, item) =>
        sum +
        Number.parseFloat(item.discount_value || 0) * (item.quantity || 0),
      0
    );
    const totalCouponDiscount = couponApplied
      ? displayedItems.reduce((sum, item) => {
          const itemDetails = calculateItemDetails(item);
          return sum + itemDetails.itemCouponDiscount;
        }, 0)
      : 0;

    const finalSubtotal =
      subtotal - totalCampaignDiscount - totalCouponDiscount;
    const hasFreeDeliveryProduct = displayedItems.some(
      (item) => item.product.free_delivary == 1
    );
    const adjustedDeliveryCharge = hasFreeDeliveryProduct
      ? 0
      : calculateDeliveryCharge();
    const orderTotal = finalSubtotal + adjustedDeliveryCharge;

    return {
      subtotal,
      totalCampaignDiscount,
      couponDiscount: totalCouponDiscount,
      deliveryCharge: adjustedDeliveryCharge,
      orderTotal,
    };
  };

  const checkCoupon = () => {
    if (!couponCode) {
      showToast("Please enter a coupon code.", "warning");
      return;
    }

    const productIds = displayedItems.map((item) => item.product.id);
    const payload = { coupon_code: couponCode, product_ids: productIds };

    dispatch(checkcoupon(payload))
      .unwrap()
      .then((response) => {
        showToast("Coupon applied successfully!", "success");
        setCouponApplied(true);
        localStorage.setItem(
          "appliedCouponProductIds",
          JSON.stringify(productIds)
        );
        localStorage.setItem("appliedCouponCode", couponCode);
        console.log("Coupon response:", response);
        dispatch(informations());
      })
      .catch((error) => {
        showToast(error, "error");
        console.error("Coupon error:", error);
        setCouponApplied(false);
        setCouponCode("");
        localStorage.removeItem("appliedCouponProductIds");
        localStorage.removeItem("appliedCouponCode");
      });
  };

  const {
    subtotal,
    totalCampaignDiscount,
    couponDiscount: totalCouponDiscount,
    deliveryCharge: charge,
    orderTotal,
  } = calculateTotal();

  return (
    <>
      <Header />
      <main>
        <section className="mb-lg-14 mb-8 mt-8">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div>
                  <div className="mb-8">
                    <h1 className="fw-bold mb-0">Checkout</h1>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row checkout-page">
                <div className="col-xl-7 col-lg-6 col-md-12">
                  <div className="card">
                    <div className="card-body checkout-from-body">
                      <h6 className="ckbMain himsilliguri">
                        অর্ডারটি কনফার্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার
                        লিখে অর্ডার কনফার্ম করুন
                      </h6>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12">
                            <label className="form-label">Your Name *</label>
                            <input
                              type="text"
                              className={`form-control ${
                                fieldErrors.name ? "is-invalid" : ""
                              }`}
                              name="name"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                            {fieldErrors.name && (
                              <div className="invalid-feedback">
                                {fieldErrors.name}
                              </div>
                            )}
                          </div>

                          {/* {user ? (
                            <>
                              <div className="d-flex justify-content-end mb-6">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary mt-2"
                                  onClick={() => setModalVisible(true)}
                                >
                                  Add New Address
                                </button>
                              </div>
                              {addresses?.map((address) => (
                                <div
                                  key={address.id}
                                  className="col-xl-5 col-lg-6 col-xxl-4 col-12 mb-4"
                                >
                                  <div className="card">
                                    <div className="card-body p-6">
                                      <div className="form-check mb-4">
                                        <input
                                          className={`form-check-input ${
                                            fieldErrors.address
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          type="radio"
                                          name="address"
                                          id={`addressRadio-${address.id}`}
                                          value={address.id}
                                          checked={
                                            formData.address === address.id
                                          }
                                          onChange={() =>
                                            handleInputChange({
                                              target: {
                                                name: "address",
                                                value: address.id,
                                              },
                                            })
                                          }
                                        />
                                        <label className="form-check-label text-dark fw-semibold">
                                          {address.type}
                                        </label>
                                      </div>
                                      <p className="mb-6">
                                        {address.name}
                                        <br />
                                        {address.address}
                                        <br />
                                        {address.city}
                                        <br />
                                        {address.phone}
                                      </p>
                                      {address.is_default && (
                                        <button
                                          type="button"
                                          className="btn btn-info btn-sm"
                                        >
                                          Default Address
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {fieldErrors.address && (
                                <div className="col-12">
                                  <div className="text-danger">
                                    {fieldErrors.address}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : ( */}
                            <div className="col-12 mt-2">
                              <label className="form-label">
                                Your Address *
                              </label>
                              <input
                                type="text"
                                className={`form-control ${
                                  fieldErrors.address ? "is-invalid" : ""
                                }`}
                                name="address"
                                placeholder="Your Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                              />
                              {fieldErrors.address && (
                                <div className="invalid-feedback">
                                  {fieldErrors.address}
                                </div>
                              )}
                            </div>
                          {/* )} */}

                          <div className="col-12 mt-2">
                            <label className="form-label">Your Mobile *</label>
                            <input
                              type="text"
                              className={`form-control ${
                                fieldErrors.phone ? "is-invalid" : ""
                              }`}
                              placeholder="Your Mobile"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              onBlur={handleSaveIncompleteOrder}
                              required
                            />
                            {fieldErrors.phone && (
                              <div className="invalid-feedback">
                                {fieldErrors.phone}
                              </div>
                            )}
                          </div>

                          <div className="col-12 mt-2">
                            <label className="form-label">
                              Alternative Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Alternative Phone Number"
                              name="alternativePhone"
                              value={formData.alternativePhone}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="col-12 mt-2">
                            <label className="form-label">Note</label>
                            <textarea
                              className="form-control"
                              name="note"
                              placeholder="Note"
                              value={formData.note}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="col-12 mt-2">
                            <label className="form-label">
                              Select Your Area *
                            </label>
                            <select
                              className={`form-control ${
                                fieldErrors.area ? "is-invalid" : ""
                              }`}
                              name="area"
                              value={formData.area}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Area</option>
                              <option value="inside">Inside Dhaka</option>
                              <option value="outside">Outside Dhaka</option>
                            </select>
                            {fieldErrors.area && (
                              <div className="invalid-feedback">
                                {fieldErrors.area}
                              </div>
                            )}
                          </div>

                          <div className="col-11 mt-5 card p-5 m-auto">
                            <h1 className="text-uppercase text-center">
                              Payment Method
                            </h1>
                            <div
                              className={`payment-type-group ${
                                fieldErrors.paymentType ? "is-invalid" : ""
                              }`}
                            >
                              <div className="payment-options d-flex align-items-center justify-content-center flex-wrap mb-4 gap-3">
                                {/* Cash on Delivery Option */}
                                <div className="form-check cs-payment-option d-flex align-items-center">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentType"
                                    value="cashon"
                                    checked={formData.paymentType === "cashon"}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="cashOnDelivery"
                                  >
                                    <img
                                      src="https://clickmart.softexel.com/public/assets/images/cod-pay.png"
                                      alt="Cash on Delivery"
                                      className="me-2"
                                      style={{ width: "90px", height: "30px" }}
                                    />
                                    <span>Cash on Delivery</span>
                                  </label>
                                </div>

                                {/* bKash Payment Option */}
                                <div className="form-check cs-payment-option d-flex align-items-center">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentType"
                                    value="bkash"
                                    checked={formData.paymentType === "bkash"}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="bkash"
                                  >
                                    <img
                                      src="https://clickmart.softexel.com/public/assets/images/bkash-pay.jpg"
                                      alt="bKash"
                                      className="me-2"
                                      style={{
                                        width: "90px",
                                        height: "30px",
                                        margin: "0 !important",
                                      }}
                                    />
                                    <span>bKash</span>
                                  </label>
                                </div>

                                {/* SSl Payment Option */}
                                {/* <div className="form-check cs-payment-option d-flex align-items-center">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentType"
                                    value="ssl"
                                    checked={formData.paymentType === "ssl"}
                                    onChange={handleInputChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="bkash"
                                  >
                                    <img
                                      src="https://sslcommerz.com/wp-content/uploads/2021/11/logo.png"
                                      alt="bKash"
                                      className="me-2"
                                      style={{ width: "100px", height: "30px" }}
                                    />
                                    <span className="m-auto">SSL</span>
                                  </label>
                                </div> */}
                              </div>
                            </div>

                            {/* Validation Error */}
                            {fieldErrors.paymentType && (
                              <div className="text-danger">
                                {fieldErrors.paymentType}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary m-auto d-block mt-5"
                          disabled={loading}
                          style={{ width: "50%", borderRadius: "20px" }}
                        >
                          {loading ? "Processing..." : "Confirm Order"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-6 col-md-12 checkout-order-list">
                  <div className="mt-4 mt-lg-0">
                    <div className="card shadow-sm">
                      <h5 className="px-6 py-4 bg-transparent mb-0">
                        Order Details
                      </h5>
                      <ul className="list-group list-group-flush">
                        {Array.isArray(displayedItems) &&
                        displayedItems.length > 0 ? (
                          displayedItems.map((item) => {
                            const itemDetails = calculateItemDetails(item);
                            return (
                              <li
                                key={`${item.product.id}${
                                  item.attributeKey || ""
                                }`}
                                className="list-group-item px-4 py-3"
                              >
                                <div className="row align-items-center">
                                  <div className=" col-sm-7 col-lg-7 mb-2">
                                    <div className="d-flex">
                                      <img
                                        src={
                                          item.product.featured_image ||
                                          "default-image.jpg"
                                        }
                                        alt={
                                          item.product.product_name ||
                                          "Unknown Product"
                                        }
                                        className="icon-shape icon-xxl"
                                      />
                                      <div className="ms-3">
                                        <h6 className="mb-0">
                                          {item.product.product_name ||
                                            "Unknown Product"}
                                        </h6>
                                        <span>
                                          <small className="text-muted">
                                            ৳{itemDetails.basePrice.toFixed(2)}{" "}
                                            * {itemDetails.quantity}
                                          </small>
                                          <small className="text-muted">
                                            {item.attributes &&
                                            item.attributes.length > 0 ? (
                                              <div>
                                                {item.attributes.map(
                                                  (attr, index) => (
                                                    <div
                                                      key={index}
                                                      className="text-muted"
                                                    >
                                                      <small>
                                                        {attr.attribute_name}:{" "}
                                                        {attr.attribute_option}
                                                      </small>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            ) : (
                                              <div className="text-muted">
                                                <small>
                                                  No attributes available
                                                </small>
                                              </div>
                                            )}
                                          </small>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className=" text-lg-end text-start text-md-end col-sm-5">
                                    Base Price - ৳
                                    {itemDetails.itemTotal.toFixed(2)}
                                    <br />
                                    Campaign - ৳
                                    {itemDetails.campaignDiscount.toFixed(2)}
                                    <br />
                                    Coupon - ৳
                                    {itemDetails.itemCouponDiscount.toFixed(2)}
                                    <br />
                                    Final Price - ৳
                                    {itemDetails.finalItemPrice.toFixed(2)}
                                  </div>
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <li className="list-group-item px-4 py-3">
                            No items found in the order.
                          </li>
                        )}
                        {(totalCampaignDiscount > 0 ||
                          totalCouponDiscount > 0) && (
                          <>
                            {totalCampaignDiscount > 0 && (
                              <li className="list-group-item px-4 py-3">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <div>Campaign Discounts</div>
                                  <div className="fw-bold text-danger">
                                    -৳{totalCampaignDiscount.toFixed(2)}
                                  </div>
                                </div>
                              </li>
                            )}
                            {totalCouponDiscount > 0 && (
                              <li className="list-group-item px-4 py-3">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <div>Coupon Discount</div>
                                  <div className="fw-bold text-danger">
                                    -৳{totalCouponDiscount.toFixed(2)}
                                  </div>
                                </div>
                              </li>
                            )}
                          </>
                        )}
                        <li className="list-group-item px-4 py-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div>Delivery Charge</div>
                            <div className="fw-bold">৳{charge.toFixed(2)}</div>
                          </div>
                        </li>
                        <li className="list-group-item px-4 py-3">
                          <div>Coupon Code </div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <input
                              className="form-control form-input"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Enter coupon code"
                              disabled={couponApplied}
                            />
                            {!couponApplied ? (
                              <button
                                onClick={checkCoupon}
                                className="btn btn-primary ms-2"
                              >
                                Apply
                              </button>
                            ) : (
                              <button
                                onClick={handleResetCoupon}
                                className="btn btn-danger ms-2"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </li>
                        <li
                          className="list-group-item px-4 py-3"
                          style={{ fontSize: "20px" }}
                        >
                          <div className="d-flex align-items-center justify-content-between fw-bold">
                            <div>Total</div>
                            <div>৳{orderTotal.toFixed(2)}</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
