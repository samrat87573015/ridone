import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartData,
  updateQuantity,
  removeFromCart,
  setActiveCart,
  removeCartItem,
  syncCart,
} from "../../api/store/slices/cartSlice";
import { useToast } from "../ToastContext";
import { Link } from "react-router-dom";
import { resetDirectOrder } from "../../api/store/slices/orderSlice";
// import { dataLayer } from "../EcommerceDataLayerService";

export default function Headercart() {
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const { items, total, itemCount, loading, error } = useSelector(
    (state) => state.cart
  );

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // Listen for cart item changes and update dataLayer
  // useEffect(() => {
  //   if (cart.items.length > 0) {
  //     dataLayer.trackCartView(cart.items, cart.total);
  //   }
  // }, [cart.items, cart.total, cart.itemCount]);

  const handleQuantityChange = (
    cartId,
    productId,
    attributeKey,
    quantity,
    type,
    attributes
  ) => {
    if (cartId && productId && quantity >= 0) {
      let quantityChange = type === "decrease" ? -1 : 1;

      // Ensure the new quantity is calculated correctly
      const newQuantity = Math.max(1, parseInt(quantity) + quantityChange);
      // Extract attribute option IDs from attributes
      const attributeValues =
        attributes?.map((attr) => attr.attribute_option_id) || [];
      // Update the quantity in the state
      dispatch(
        updateQuantity({
          cartId, // Pass cartId for the item
          productId, // Pass productId
          attributeKey, // Pass attributeKey
          quantity: newQuantity, // Pass the new calculated quantity
        })
      );

      // Sync the cart with the backend
      dispatch(
        syncCart({
          cartId,
          attributeKey: attributeValues,
          productId: productId,
          quantity: quantityChange,
        })
      )
        .then(() => {
          dispatch(fetchCartData()); // Fetch updated cart data after sync
        })
        .catch((error) => {
          console.error("Failed to sync cart:", error);
        });

      showToast("Cart product quantity updated successfully!", "success");
    }
  };

  const handleRemoveItem = (productId,cartId, attributeKey) => {
    //console.log(cartId);
    // Dispatch the removeCartItem action to remove the item
    if (productId) {
    
      dispatch(
        removeCartItem({
          productId,
          cartId,
          attributeKey: attributeKey || "",
        })
      )
        .then(() => {
          // After removing the item, fetch the latest cart data
          dispatch(fetchCartData());
          showToast("Cart product removed successfully!", "success");
        })
        .catch((error) => {
          console.error("Error removing cart item:", error);
          showToast("Failed to remove item from cart", "error");
        });
    }
  };

  const removeCartSection = () => {
    dispatch(setActiveCart(false));
  };
  const checkout = () => {
    dispatch(resetDirectOrder());
    dispatch(setActiveCart(false));
  };

  // if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error:", error);
    return <p>Error: {error.message || "An error occurred"}</p>;
  }

  return (
    <>
      <div className="offcanvas-header border-bottom">
        <div className="text-start">
          <h5 id="offcanvasRightLabel" className="mb-0 fs-4">
            Shop Cart
          </h5>
          {/* <small>Location in 382480</small> */}
        </div>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={removeCartSection}
        ></button>
      </div>
      <div className="offcanvas-body">
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {/* <div className="alert alert-danger p-2" role="alert">
              You've got FREE delivery. Start
              <a href="#!" className="alert-link">
                checkout now!
              </a>
            </div> */}
            <ul className="list-group list-group-flush">
              {[
                ...new Map(
                  items.map((item) => [
                    item.product.id + (item.attributeKey || ""),
                    item,
                  ])
                ).values(),
              ].map((item) => (
                <li
                  key={`${item.product.id}${item.attributeKey || ""}`}
                  className="list-group-item py-3 ps-0 border-top"
                >
                  {/* Display the item as JSON */}

                  <div className="row align-items-center">
                    <div className="col-6 col-md-6 col-lg-7">
                      <div className="d-flex">
                        <img
                          src={
                            item.product.featured_image || "default-image.jpg"
                          }
                          alt={item.product.product_name || "Unknown Product"}
                          className="icon-shape icon-xxl"
                        />
                        <div className="ms-3">
                          <a
                            href="pages/shop-single.html"
                            className="text-inherit"
                          >
                            <h6 className="mb-0">
                              {item.product.product_name || "Unknown Product"}
                            </h6>
                          </a>
                          <span>
                            <small className="text-muted">
                              ৳{parseFloat(item.product.price) || 0}
                            </small>
                          </span>

                          {/* Display selected attributes if they exist */}
                          {item.attributes && item.attributes.length > 0 ? (
                            <div className="mt-1">
                              {[
                                ...new Map(
                                  item.attributes.map((attr) => [
                                    attr.attribute_name,
                                    attr,
                                  ])
                                ).values(),
                              ].map((attr, idx) => (
                                <small key={idx} className="d-block text-muted">
                                  {attr.attribute_name}: {attr.attribute_option}
                                </small>
                              ))}
                            </div>
                          ) : (
                            <small className="d-block text-muted">
                              No attributes available
                            </small>
                          )}

                          <div className="mt-2 small lh-1">
                            <button
                              
                              className="text-decoration-none border-0 bg-transparent text-inherit"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveItem(
                                  item.product.id,
                                  item.id,
                                  item.attributeKey
                                );
                              }}
                            >
                              <span className="me-1 align-text-bottom">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2 text-success"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </span>
                              <span className="text-muted">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" col-4 col-md-3 col-lg-3">
                      <div className="d-none input-group input-spinner">
                        <input
                          type="button"
                          value="-"
                          className="button-minus btn btn-sm"
                          onClick={() =>
                            handleQuantityChange(
                              item.id, // Pass cart_id
                              item.product.id, // Pass product id
                              item.attributeKey, // Pass attribute key
                              item.quantity, // Current quantity
                              "decrease", // Specify the type as 'decrease'
                              item.attributes // Pass attributes
                            )
                          }
                        />
                        <input
                          type="number"
                          step="1"
                          max="10"
                          value={item.quantity || 0}
                          className="quantity-field form-control-sm form-input"
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id, // Pass cart_id
                              item.product.id, // Pass product id
                              item.attributeKey, // Pass attribute key
                              Math.max(1, parseInt(e.target.value) || 1), // New quantity value
                              "increase", // Specify the type as 'increase'
                              item.attributes // Pass attributes
                            )
                          }
                        />
                        <input
                          type="button"
                          value="+"
                          className="button-plus btn btn-sm"
                          onClick={() =>
                            handleQuantityChange(
                              item.id, // Pass cart_id
                              item.product.id, // Pass product id
                              item.attributeKey, // Pass attribute key
                              item.quantity, // Current quantity
                              "increase", // Specify the type as 'increase'
                              item.attributes // Pass attributes
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-2 text-lg-end text-start text-md-end col-md-2">
                      <span className="fw-bold">
                        ৳{" "}
                        {parseFloat(item.product.price) * (item.quantity || 0)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-end mt-4">
              <h6>Total: ৳{total || 0}</h6>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <a className="btn btn-primary" onClick={removeCartSection}>
                Continue Shopping
              </a>
              <Link
                to="/checkout"
                className="btn btn-primary"
                onClick={checkout}
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
