import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  setDelivaryCost,
} from "../../api/store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { saveIncompleteOrder } from "../../api/store/slices/orderSlice";
import {
  fetchAddresses,
  createAddress,
  getUserData,
} from "../../api/store/slices/userSlice";
import AddressForm from "../auth/account/AddressForm";
import { useToast } from "../ToastContext";
import { generateGuestId } from "../../api/store/slices/cartSlice";

export default function Details() {
  const guestId = generateGuestId();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { isDirectOrder, directOrderItems, sitedata } = useSelector(
    (state) => state.order
  );
  const { user, addresses } = useSelector((state) => state.user || {});
  const cartItems = useSelector((state) => state.cart.items);

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
  });

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    address: "",
    phone: "",
    area: "",
    paymentType: "",
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [DelivaryCharge, setDelivaryCharge] = useState("none");

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
  }, [user, dispatch, showToast]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
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
      // const payload = {
      //   items,
      //   userDetails: formData,
      //   deliveryCharge: DelivaryCharge,
      // };
      // await dispatch(saveIncompleteOrder(payload)).unwrap();

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

      showToast("Draft order saved", "success");
    } catch (error) {
      showToast("Failed to save draft order", "error");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate each required field
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const items = isDirectOrder ? directOrderItems : cartItems;

    if (!items) {
      showToast("No items in cart", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await dispatch(
        createOrder({
          items,
          isDirectOrder,
          userDetails: formData,
          Delivary_charge: DelivaryCharge,
          Order_status: "pending",
        })
      ).unwrap();

      Navigate(`/checkout/success/${response.invoice_number}`);
    } catch (err) {
      showToast(err.message || "Failed to create order", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (values) => {
    try {
      await dispatch(createAddress(values)).unwrap();
      setModalVisible(false);
      showToast("Address added successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to add address", "error");
    }
  };

  return (
    <div className="col-xl-7 col-lg-6 col-md-12">
<div className="card">
  <div className="card-body checkout-from-body">
    <h6 className="ckbMain himsiliguri">
      To confirm the order, please write your name, address, and mobile number and confirm the order.
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
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
        </div>

        {user ? (
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
                          fieldErrors.address ? "is-invalid" : ""
                        }`}
                        type="radio"
                        name="address"
                        id={`addressRadio-${address.id}`}
                        value={address.id}
                        checked={formData.address === address.id}
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
                <div className="text-danger">{fieldErrors.address}</div>
              </div>
            )}
          </>
        ) : (
          <div className="col-12 mt-2">
            <label className="form-label">Your Address *</label>
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
        )}

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
            <div className="invalid-feedback">{fieldErrors.phone}</div>
          )}
        </div>

        <div className="col-12 mt-2">
          <label className="form-label">Alternative Phone Number</label>
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
          <label className="form-label">Select Your Area *</label>
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
            <div className="invalid-feedback">{fieldErrors.area}</div>
          )}
        </div>

        <div className="col-11 mt-5 card p-5 m-auto">
          <h1 className="text-uppercase text-center">Payment Method</h1>
          <div
            className={`payment-type-group ${
              fieldErrors.paymentType ? "is-invalid" : ""
            }`}
          >
            <div className="payment-options d-flex align-items-center flex-wrap mb-4 gap-3">
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
                <label className="form-check-label" htmlFor="bkash">
                  <img
                    src="https://clickmart.softexel.com/public/assets/images/bkash-pay.jpg"
                    alt="bKash"
                    className="me-2"
                    style={{ width: "90px", height: "30px",margin:'0 !important', }}
                  />
                  <span>bKash</span>
                </label>
              </div>


              {/* SSl Payment Option */}
              <div className="form-check cs-payment-option d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentType"
                  value="ssl"
                  checked={formData.paymentType === "ssl"}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="bkash">
                  <img
                    src="https://sslcommerz.com/wp-content/uploads/2021/11/logo.png"
                    alt="bKash"
                    className="me-2"
                    style={{ width: "100px", height: "30px" }}
                  />
                  <span className="m-auto">SSL</span>
                </label>
              </div>


            </div>
          </div>

          {/* Validation Error */}
          {fieldErrors.paymentType && (
            <div className="text-danger">{fieldErrors.paymentType}</div>
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


      {modalVisible && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Address</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalVisible(false)}
                  />
                </div>
                <div className="modal-body">
                  <AddressForm
                    onSubmit={handleAddAddress}
                    onCancel={() => setModalVisible(false)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}
