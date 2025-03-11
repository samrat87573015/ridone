import React, { useEffect, useState,useRef } from "react";
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
import Productmodel from "../singleproduct/productmodel";


import {
  addToCart,
  selectCartError,
  clearError,
  addCartBackend,
} from "../../api/store/slices/cartSlice";

import { setDirectOrder } from "../../api/store/slices/orderSlice";
import { useLoading } from "../LoadingContext";



export default function Landingorder(item) {
  const guestId = generateGuestId();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { isDirectOrder, directOrderItems, sitedata } = useSelector(
    (state) => state.order
  );
  const { user, addresses } = useSelector((state) => state.user || {});
  const cartItems = useSelector((state) => state.cart.items);
  const [quantities, setQuantities] = useState({}); // Store quantities for each product
  const [Error, setError] = useState([]); // Store quantities for each product
  const [selectedAttributes, setSelectedAttributes] = useState({});
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
  const [selectedProduct, setselectedProduct] = useState(item.item[0]);
  const error = useSelector(selectCartError);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const thumbnailsRef = useRef(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const [productHeight, setProductHeight] = useState("70vh"); // Manage the height of the product modal












  useEffect(() => {
    const fetchData = async () => {
     
      try {
        if (user) {
          await dispatch(fetchAddresses()).unwrap();
        } else {
          await dispatch(getUserData()).unwrap();
          await dispatch(fetchAddresses()).unwrap();
        }
        // if(!selectedProduct)
        // {
        //     setselectedProduct(item.item[0])
        // }
       
      } catch (err) {
        showToast("Failed to fetch user data or addresses", "error");
      }
    };

    fetchData();
  }, [user,dispatch, showToast]);

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
    e.preventDefault(); // Prevents page refresh
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

  const handleSaveIncompleteOrder = async (event) => {
    event.preventDefault(); // Prevents page refresh

   
    

    try {

        const baseProduct = selectedProduct || item.item;

        // Validate attributes before proceeding
        const validation = validateAttributes(
          baseProduct.product_attributes,
          selectedAttributes
        );
    
        if (!validation.isValid) {
          setLoading(false);
          const errorMessage = `Please select ${validation.missingAttributes.join(
            ", "
          )}`;
          showToast(errorMessage, "error");
          setError([errorMessage]);
          return;
        }
    
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
          free_delivary: baseProduct.is_free_shipping,
          price: calculatedPrice / getQuantity(baseProduct.id),
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






    const baseProduct = selectedProduct || item.item;

        // Validate attributes before proceeding
        const validation = validateAttributes(
          baseProduct.product_attributes,
          selectedAttributes
        );
    
        if (!validation.isValid) {
          setLoading(false);
          const errorMessage = `Please select ${validation.missingAttributes.join(
            ", "
          )}`;
          showToast(errorMessage, "error");
          setError([errorMessage]);
          return;
        }
    
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
          free_delivary: baseProduct.is_free_shipping,
          price: calculatedPrice / getQuantity(baseProduct.id),
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


  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => {
      const updatedQuantities = {
        ...prev,
        [productId]: Math.max(1, (prev[productId] || 1) + value), // Ensure at least 1 quantity
      };

      // Recalculate price based on updated quantity
      setCalculatedPrice(
        calculatePrice(
          selectedProduct,
          selectedAttributes,
          updatedQuantities[productId]
        )
      );

      return updatedQuantities;
    });
  };

  const handleAttributeSelect = (
    attributeId,
    attributeOptionId,
    optionName,
    attributeName,
    attributePrice,
    combineId
  ) => {
    setSelectedAttributes((prev) => {
      const updatedAttributes = {
        ...prev,
        [attributeId]: {
          attributeOptionId,
          optionName,
          attributeName,
          attributePrice,
          combineId,
        },
      };

      // Recalculate price based on updated attributes
      setCalculatedPrice(
        calculatePrice(
          selectedProduct,
          updatedAttributes,
          getQuantity(selectedProduct.id)
        )
      );

      return updatedAttributes;
    });
  };

  const calculatePrice = (product, selectedAttributes, quantity) => {
    if (!product) return 0;

    const basePrice = parseFloat(product.price);
    console.log(selectedAttributes);
    const attributePrice = Object.values(selectedAttributes).reduce(
      (sum, attr) => {
        return sum + parseFloat(attr.attributePrice || 0); // Add attribute-specific price adjustments
      },
      0
    );

    console.log(attributePrice);

    // Total price with attributes and quantity
    const totalPrice = (basePrice + attributePrice) * quantity;
    return totalPrice;
  };

  const getQuantity = (productId) => {
    return quantities[productId] || 1; // Default to 1 if quantity is not found
  };


// Helper function to validate required attributes
const validateAttributes = (productAttributes, selectedAttributes) => {
    // Separate combined and single attributes
    const combinationGroups = {};
    const singleAttributes = [];

    productAttributes.forEach((attr) => {
      if (attr.combination_id) {
        if (!combinationGroups[attr.combination_id]) {
          combinationGroups[attr.combination_id] = [];
        }
        combinationGroups[attr.combination_id].push(attr);
      } else {
        // Group single attributes by their attribute_id
        const existingAttr = singleAttributes.find(
          (a) => a.attribute_id === attr.attribute_id
        );
        if (!existingAttr) {
          singleAttributes.push(attr);
        }
      }
    });

    const missingAttributes = [];

    // Validate combined attributes - all must be selected
    Object.values(combinationGroups).forEach((group) => {
      if (group.length > 0) {
        const uniqueAttrs = new Set(group.map((attr) => attr.attribute_id));
        uniqueAttrs.forEach((attrId) => {
          if (!selectedAttributes[attrId]) {
            const attrName = group.find((attr) => attr.attribute_id === attrId)
              ?.attribute.name;
            if (attrName && !missingAttributes.includes(attrName)) {
              missingAttributes.push(attrName);
            }
          }
        });
      }
    });

    // Validate single attributes - at least one must be selected
    if (
      singleAttributes.length > 0 &&
      Object.keys(selectedAttributes).length === 0
    ) {
      const singleAttrNames = [
        ...new Set(singleAttributes.map((attr) => attr.attribute.name)),
      ];
      if (singleAttrNames.length > 0) {
        missingAttributes.push(
          `at least one of the following: ${singleAttrNames.join(" or ")}`
        );
      }
    }

    return {
      isValid: missingAttributes.length === 0,
      missingAttributes,
    };
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
      

      <div className="mb-4 mt-5">
    <h4 className="">Your Order</h4>
    
    <table className="table table-bordered table-hover">
        <thead className="table-light">
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Attributes</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {item.item.map((item, index) => (
                <tr key={index} className="align-middle" style={{ height: '40px' }}>
                    <td className="d-flex align-items-center gap-2">
                        <img 
                            src={item?.featured_image || "/placeholder.svg"} 
                            alt="Product" 
                            className="img-fluid rounded" 
                            style={{ width: 50, height: 50 }}
                        />
                        <span>{item?.product_name}</span>
                    </td>
                    
                    <td>
                        <div className="input-group input-group-sm" style={{width:'35%',height:'35px',margin:'auto' }}>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                            <input type="number" className="form-control text-center" value={quantities[item.id] || 1} readOnly />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        </div>
                    </td>
                    
                    <td>
                        {item.product_attributes && item.product_attributes.length > 0 ? (
                            Object.values(
                                item.product_attributes.reduce((acc, attribute) => {
                                    if (!acc[attribute.attribute_id]) {
                                        acc[attribute.attribute_id] = { ...attribute, options: [] };
                                    }
                                    if (attribute.attribute_option) {
                                        const isOptionUnique = acc[attribute.attribute_id].options.every(
                                            (opt) => opt.id !== attribute.attribute_option.id
                                        );
                                        if (isOptionUnique) {
                                            acc[attribute.attribute_id].options.push({
                                                ...attribute.attribute_option,
                                                quantity: attribute.quantity,
                                                price: attribute.price,
                                                productAttributeId: attribute.id,
                                            });
                                        }
                                    }
                                    return acc;
                                }, {})
                            ).map((attribute) => (
                                <div key={attribute.attribute_id} className="mb-2">
                                    <label className="form-label fw-semibold">{attribute.attribute?.name || "Attribute"}:</label>
                                    <div>
                                        {attribute.options && attribute.options.length > 0 ? (
                                            attribute.options.map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    className={`btn btn-sm btn-outline-primary m-1 ${
                                                        selectedAttributes[attribute.attribute_id]?.attributeOptionId === option.id
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() => option.quantity > 0 && handleAttributeSelect(
                                                        attribute.attribute_id,
                                                        option.id,
                                                        option.name,
                                                        attribute.attribute.name,
                                                        option.price,
                                                        attribute.combination_id,
                                                        option.productAttributeId
                                                    )}
                                                    disabled={option.quantity === 0}
                                                >
                                                    {option.name} {option.quantity === 0 && <span className="text-danger">(Out of stock)</span>}
                                                </button>
                                            ))
                                        ) : (
                                            <span className="text-muted">No options available</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No attributes available</p>
                        )}
                    </td>
                    
                    <td className="fw-bold text-primary">৳ {item?.price}</td>
                </tr>
            ))}
        </tbody>
    </table>
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
