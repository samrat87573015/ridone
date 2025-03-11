import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../../api/store/slices/cartSlice";
import { checkcoupon, informations, setDirectOrder } from "../../api/store/slices/orderSlice";
import { useToast } from "../ToastContext";

export default function Order() {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const {
    items: cartItems = [],
    total: cartTotal = 0,
  } = useSelector((state) => state.cart || {});

  const {
    isDirectOrder,
    directOrderItems,
    deliveryCharge = 0,
    couponResponse = null,
  } = useSelector((state) => state.order || {});

  useEffect(() => {
    if (isDirectOrder) {
      dispatch(setDirectOrder(directOrderItems));
    } else {
      dispatch(fetchCartData());
    }
    dispatch(informations());
  }, [dispatch, isDirectOrder, directOrderItems]);

  // Determine which items to display
  const displayedItems = isDirectOrder
    ? Array.isArray(directOrderItems)
      ? directOrderItems
      : [directOrderItems] // Wrap single object into an array
    : Array.isArray(cartItems)
    ? cartItems
    : [];

  const calculateItemDetails = (item) => {
    const basePrice = parseFloat(item.product.price || 0);
    const quantity = item.quantity || 0;
  
    // Base item total
    const itemTotal = basePrice * quantity;
  
    // Campaign discount (applied per item, multiplied by quantity)
    const campaignDiscount = item.discount_value
      ? parseFloat(item.discount_value) * quantity
      : 0;
  
    // Check if this item is part of the coupon discount
    let itemCouponDiscount = 0;
    if (couponApplied && couponResponse && couponResponse.product_discounts) {
      const productDiscount = couponResponse.product_discounts.find(
        (discount) => discount.product_id === item.product.id
      );
      if (productDiscount) {
        // Apply product-specific coupon discount
        const perItemCouponDiscount = parseFloat(productDiscount.discount_amount || 0);
        itemCouponDiscount = perItemCouponDiscount * quantity;
      }
    }
  
    // Final item price after discounts
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
  
  const calculateDeliveryCharge = () => {
    // Original delivery charge from Redux
    const originalDeliveryCharge = deliveryCharge || 0;

    // If no items or no delivery charge, return 0
    if (!displayedItems.length || originalDeliveryCharge === 0) {
      return 0;
    }

    // Identify free delivery products
    const freeDeliveryProducts = displayedItems.filter(
      item => item.product.free_delivery === 1
    );

    // If all products have free delivery, return 0
    if (freeDeliveryProducts.length === displayedItems.length) {
      return 0;
    }

    // Calculate total prices for free and paid delivery products
    const freeDeliveryProductsTotal = freeDeliveryProducts.reduce(
      (sum, item) => sum + (parseFloat(item.product.price || 0) * (item.quantity || 0)),
      0
    );

    const paidDeliveryProductsTotal = displayedItems.reduce(
      (sum, item) => sum + (parseFloat(item.product.price || 0) * (item.quantity || 0)),
      0
    ) - freeDeliveryProductsTotal;

    // If no paid delivery products, return 0
    if (paidDeliveryProductsTotal <= 0) {
      return 0;
    }

    // Calculate proportional delivery charge
    const deliveryChargeRatio = paidDeliveryProductsTotal / 
      (freeDeliveryProductsTotal + paidDeliveryProductsTotal);
    
    const adjustedDeliveryCharge = originalDeliveryCharge * deliveryChargeRatio;

    return Math.max(0, adjustedDeliveryCharge);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    
    // Calculate total campaign discount
    const totalCampaignDiscount = displayedItems.reduce(
      (sum, item) => sum + (parseFloat(item.discount_value || 0) * (item.quantity || 0)),
      0
    );
  
    // Calculate total coupon discount
    const totalCouponDiscount = couponApplied
      ? displayedItems.reduce((sum, item) => {
          const itemDetails = calculateItemDetails(item);
          return sum + itemDetails.itemCouponDiscount;
        }, 0)
      : 0;
  
    // Final subtotal after discounts
    const finalSubtotal = subtotal - totalCampaignDiscount - totalCouponDiscount;
        console.log(displayedItems)
    // Check if any product has free delivery
    const hasFreeDeliveryProduct = displayedItems.some(
      (item) => item.product.free_delivary == 1
    );
  
    console.log(hasFreeDeliveryProduct);
    // If any product has free delivery, set delivery charge to 0
    const adjustedDeliveryCharge = hasFreeDeliveryProduct ? 0 : calculateDeliveryCharge();
  
    // Calculate order total
    const orderTotal = finalSubtotal + adjustedDeliveryCharge;
  
    return {
      subtotal,
      totalCampaignDiscount,
      couponDiscount: totalCouponDiscount,
      deliveryCharge: adjustedDeliveryCharge,
      orderTotal,
    };
  };
  
  // Calculate subtotal before discounts
  const calculateSubtotal = () => {
    return Array.isArray(displayedItems)
      ? displayedItems.reduce(
          (sum, item) => sum + parseFloat(item.product.price || 0) * (item.quantity || 0),
          0
        )
      : 0;
  };

  // Extract product IDs from displayed items
  const productIds = displayedItems.map((item) => item.product.id);

  // Check Coupon Function
  const checkCoupon = () => {
    if (!couponCode) {
      showToast("Please enter a coupon code.", "warning");
      return;
    }

    // Prepare payload
    const payload = {
      coupon_code: couponCode,
      product_ids: productIds,
    };

    // Dispatch the action
    dispatch(checkcoupon(payload))
      .unwrap()
      .then((response) => {
        showToast("Coupon applied successfully!", "success");
        
        // Set coupon as applied to trigger recalculation
        setCouponApplied(true);

        // Re-fetch order details to get the updated data
        dispatch(informations());
        
        console.log("Coupon response:", response);
      })
      .catch((error) => {
        showToast(error, "error");
        console.error("Coupon error:", error);
        
        // Reset coupon application if it fails
        setCouponApplied(false);
        setCouponCode("");
      });
  };

  // Calculate total with coupon considerations
  const {
    subtotal,
    totalCampaignDiscount,
    couponDiscount: totalCouponDiscount,
    deliveryCharge: charge,
    orderTotal,
  } = calculateTotal();

  // Function to reset coupon
  const resetCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    dispatch(informations());
  };

  return (
    <div className="col-xl-5 col-lg-6 col-md-12 checkout-order-list">
      <div className="mt-4 mt-lg-0">
        <div className="card shadow-sm">
          <h5 className="px-6 py-4 bg-transparent mb-0">Order Information</h5>
          <ul className="list-group list-group-flush">
            {Array.isArray(displayedItems) && displayedItems.length > 0 ? (
              displayedItems.map((item) => {
                const itemDetails = calculateItemDetails(item);
                return (
                  <li
                    key={`${item.product.id}${item.attributeKey || ""}`}
                    className="list-group-item px-4 py-3"
                  >
                    <div className="row align-items-center">
                      <div className="col-7 col-md-7 col-lg-7">
                        <div className="d-flex">
                          <img
                            src={item.product.featured_image || "default-image.jpg"}
                            alt={item.product.product_name || "Unknown Product"}
                            className="icon-shape icon-xxl"
                          />
                          <div className="ms-3">
                            <h6 className="mb-0">
                              {item.product.product_name || "Unknown Product"}
                            </h6>
                            <span>
                              <small className="text-muted">
                                ৳{itemDetails.basePrice.toFixed(2)} * {itemDetails.quantity}
                              </small>
                              <small className="text-muted">
                              {item.attributes && item.attributes.length > 0 ? (
    <div>
      {item.attributes.map((attr, index) => (
        <div key={index} className="text-muted">
          <small>
            {attr.attribute_name}: {attr.attribute_option}
          </small>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-muted">
      <small>No attributes available</small>
    </div>
  )}
                       
                              </small>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-5 text-lg-end text-start text-md-end col-md-5">
                        Base Price - ৳{itemDetails.itemTotal.toFixed(2)}<br />
                        Campaign - ৳{itemDetails.campaignDiscount.toFixed(2)}<br />
                        Coupon - ৳{itemDetails.itemCouponDiscount.toFixed(2)}<br />
                        Final Price - ৳{itemDetails.finalItemPrice.toFixed(2)}
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

            {/* Show discount sections only if there are active discounts */}
            {(totalCampaignDiscount > 0 || totalCouponDiscount > 0) && (
              <>
                {totalCampaignDiscount > 0 && (
                  <li className="list-group-item px-4 py-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>Campaign Discounts</div>
                      <div className="fw-bold text-danger">-৳{totalCampaignDiscount.toFixed(2)}</div>
                    </div>
                  </li>
                )}

                {totalCouponDiscount > 0 && (
                  <li className="list-group-item px-4 py-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>Coupon Discount</div>
                      <div className="fw-bold text-danger">-৳{totalCouponDiscount.toFixed(2)}</div>
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
                    <button onClick={checkCoupon} className="btn btn-primary ms-2">
                      Apply
                    </button>
                  ) : (
                    <button onClick={resetCoupon} className="btn btn-danger ms-2">
                      Remove
                    </button>
                  )}
             
              </div>
            </li>

            <li className="list-group-item px-4 py-3" style={{fontSize:'20px'}} >
              <div className="d-flex align-items-center justify-content-between fw-bold">
                <div>Total</div>
                <div>৳{orderTotal.toFixed(2)}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}