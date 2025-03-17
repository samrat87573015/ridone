"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Minus, Plus } from "lucide-react"
import { addToCart, selectCartError, addCartBackend } from "../../api/store/slices/cartSlice"
import { useSelector } from "react-redux"
import { setDirectOrder } from "../../api/store/slices/orderSlice"
import { useLoading } from "../LoadingContext"
import { useToast } from "../ToastContext"
// import { dataLayer } from "../EcommerceDataLayerService"

export default function Productmodel({ selectedProduct }) {
  const zoomStyles = `
  .product.productModal {
    position: relative;
    overflow: hidden;
  }
  
  .zoom-overlay {
    background-color: white;
    z-index: 10;
  }
  
  .zoom-overlay img {
    transform-origin: 0 0;
  }
  
  @media (max-width: 768px) {
    .zoom-overlay {
      display: none;
    }
  }
`


  const { setLoading } = useLoading()
  const { showToast } = useToast()
  const error = useSelector(selectCartError)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const thumbnailsRef = useRef(null)

  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const zoomContainerRef = useRef(null)
  const zoomImageRef = useRef(null)

  const [quantities, setQuantities] = useState({}) // Store quantities for each product
  const [Error, setError] = useState([]) // Store quantities for each product
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const [calculatedPrice, setCalculatedPrice] = useState(0)

  const { items, total, itemCount, loading } = useSelector((state) => state.cart)
  const cart = useSelector((state) => state.cart) // Get the latest cart state
  const [productHeight, setProductHeight] = useState("70vh") // Manage the height of the product modal
  const siteinfos = useSelector(state => state.home.siteinfos[0])

  // Function to get product images
  const getProductImages = (product) => {
    let galleryImages = []
    try {
      galleryImages = product?.gallery_images ? JSON.parse(product.gallery_images) : []
    } catch (error) {
      console.error("Error parsing gallery_images:", error)
      galleryImages = []
    }
    const images = [product.featured_image, ...galleryImages].filter((img) => img && img !== "null" && img !== "")
    return images.length > 0
      ? [...new Set(images)] // Remove duplicates
      : ["assets/images/products/product-img-1.jpg"]
  }

  // Update product height dynamically based on active image
  useEffect(() => {
    if (activeIndex === 0) {
      setProductHeight("70vh")
    } else {
      setProductHeight("auto")
    }
  }, [activeIndex])

  const calculatePrice = (product, selectedAttributes, quantity) => {
    if (!product) return 0

    const basePrice = Number.parseFloat(product.price)
    const attributePrice = Object.values(selectedAttributes).reduce((sum, attr) => {
      return sum + Number.parseFloat(attr.attributePrice || 0) // Add attribute-specific price adjustments
    }, 0)

    // Total price with attributes and quantity
    const totalPrice = (basePrice + attributePrice) * quantity
    return totalPrice
  }

  const getQuantity = (productId) => {
    return quantities[productId] || 1 // Default to 1 if quantity is not found
  }

  // Prepare attributes in the format expected by the cart system
  // Prepare attributes to match the exact JSON structure
  const prepareAttributes = (selectedAttributes) => {
    return Object.entries(selectedAttributes).map(([attributeName, value]) => ({
      attribute_name: attributeName,
      attribute_option_id: value.attribute_option_id,
      attribute_option: value.attribute_option,
    }))
  }

  // Helper function to validate required attributes
  const validateAttributes = (productAttributes, selectedAttributes) => {
    // Separate combined and single attributes
    const combinationGroups = {}
    const singleAttributes = []

    productAttributes.forEach((attr) => {
      if (attr.combination_id) {
        if (!combinationGroups[attr.combination_id]) {
          combinationGroups[attr.combination_id] = []
        }
        combinationGroups[attr.combination_id].push(attr)
      } else {
        // Group single attributes by their attribute_id
        const existingAttr = singleAttributes.find((a) => a.attribute_id == attr.attribute_id)
        if (!existingAttr) {
          singleAttributes.push(attr)
        }
      }
    })

    const missingAttributes = []

    // Validate combined attributes - all must be selected
    Object.values(combinationGroups).forEach((group) => {
      if (group.length > 0) {
        const uniqueAttrs = new Set(group.map((attr) => attr.attribute_id))
        uniqueAttrs.forEach((attrId) => {
          if (!selectedAttributes[attrId]) {
            const attrName = group.find((attr) => attr.attribute_id == attrId)?.attribute.name
            if (attrName && !missingAttributes.includes(attrName)) {
              missingAttributes.push(attrName)
            }
          }
        })
      }
    })

    // Validate single attributes - at least one must be selected
    if (singleAttributes.length > 0 && Object.keys(selectedAttributes).length === 0) {
      const singleAttrNames = [...new Set(singleAttributes.map((attr) => attr.attribute.name))]
      if (singleAttrNames.length > 0) {
        missingAttributes.push(`at least one of the following: ${singleAttrNames.join(" or ")}`)
      }
    }

    return {
      isValid: missingAttributes.length === 0,
      missingAttributes,
    }
  }

  // Modified handleAddToCart function
  const HandleAddToCart = async (product) => {
    setLoading(true)
    setError([])
    if (!selectedProduct && !product) {
      console.error("No product found!")
      return
    }

    const baseProduct = selectedProduct || product

    // Validate attributes before proceeding
    const validation = validateAttributes(baseProduct.product_attributes, selectedAttributes)

    if (!validation.isValid) {
      setLoading(false)
      const errorMessage = `Please select ${validation.missingAttributes.join(", ")}`
      showToast(errorMessage, "error")
      setError([errorMessage])
      return
    }

    // Prepare cart item
    const cartItem = {
      id: null,
      product_id: baseProduct.id,
      quantity: getQuantity(baseProduct.id) || 1,
      campaign_id: baseProduct.product_campaign ? baseProduct.product_campaign.campaign_id : null,
      discount_value: baseProduct.product_campaign ? baseProduct.product_campaign.campaign.discount : null,
      product: {
        id: baseProduct.id,
        product_name: baseProduct.product_name,
        free_delivary: baseProduct.is_free_shipping,
        price: calculatedPrice / getQuantity(baseProduct.id),
        featured_image: baseProduct.featured_image,
      },
      attribute_values: Object.values(selectedAttributes).map((data) => Number.parseInt(data.id)),
      selectedAttributes: Object.entries(selectedAttributes).map(([attributeId, data]) => ({
        attribute_id: Number.parseInt(attributeId, 10),
        attribute_option_id: data.attributeOptionId,
        attribute_name: data.attributeName,
        attribute_option: data.optionName,
        attribute_option_price: data.attributePrice,
        id: data.id,
      })),
    }

    try {
      const result = await dispatch(addCartBackend(cartItem)).unwrap()
      dispatch(addToCart(cartItem))

      setLoading(false)

      // window.dataLayer = window.dataLayer || []

      // window.dataLayer.push({
      //   event: "add_to_cart",
      //   ecommerce: {
      //     items: [
      //       {
      //         item_name: baseProduct.product_name,
      //         item_id: String(baseProduct.id),
      //         price: String(calculatedPrice / getQuantity(baseProduct.id)),
      //         item_brand: baseProduct.brand?.name || null,
      //         item_category: baseProduct.category?.name || null,
      //         index: 0,
      //         quantity: String(getQuantity(baseProduct.id)),
      //       },
      //     ],
      //   },
      // })

      if (selectedProduct) {
        setSelectedAttributes({})
        setQuantities({})
      }
    } catch (error) {
      setLoading(false)
      console.error("Failed to sync cart:", error)
      showToast(error, "error")
      setError([error])
    }
  }

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => {
      const updatedQuantities = {
        ...prev,
        [productId]: Math.max(1, (prev[productId] || 1) + value), // Ensure at least 1 quantity
      }

      // Recalculate price based on updated quantity
      setCalculatedPrice(calculatePrice(selectedProduct, selectedAttributes, updatedQuantities[productId]))

      return updatedQuantities
    })
  }

  const handleAttributeSelect = (
    attributeId,
    attributeOptionId,
    optionName,
    attributeName,
    attributePrice,
    productAttributeId,
  ) => {
    setSelectedAttributes((prev) => {
      const updatedAttributes = {
        ...prev,
        [attributeId]: {
          attributeOptionId,
          optionName,
          attributeName,
          attributePrice,
          id: productAttributeId,
          quantity: selectedProduct.product_attributes.find((attr) => attr.id === productAttributeId)?.quantity || 0, // Get quantity of the selected attribute
        },
      }

      const hasValidCombination = selectedProduct.product_attributes.some((attr) => attr.combination_id !== null)

      if (!hasValidCombination) {
        return updatedAttributes
      }

      const selectedOptionNames = Object.values(updatedAttributes).map((attr) => attr.optionName)

      const matchingCombination = selectedProduct.product_attributes.find((attr) => {
        if (!attr.combination_id) return false

        const attributesInCombination = selectedProduct.product_attributes.filter(
          (a) => a.combination_id === attr.combination_id,
        )

        const combinationOptionNames = attributesInCombination.map((a) => a.attribute_option.name)

        return selectedOptionNames.every((name) => combinationOptionNames.includes(name))
      })

      if (!matchingCombination) return updatedAttributes

      const selectedCombinationId = matchingCombination.combination_id

      const validAttributes = selectedProduct.product_attributes.filter(
        (attr) => attr.combination_id === selectedCombinationId,
      )

      const newAttributes = { ...updatedAttributes }

      validAttributes.forEach((attr) => {
        if (newAttributes[attr.attribute_id]) {
          newAttributes[attr.attribute_id] = {
            attributeOptionId: attr.attribute_option.id,
            optionName: attr.attribute_option.name,
            attributeName: attr.attribute.name,
            attributePrice: attr.price,
            id: attr.id,
            combinationId: selectedCombinationId,
            quantity: attr.quantity, // Include quantity for selected attributes
          }
        }
      })

      setCalculatedPrice(calculatePrice(selectedProduct, newAttributes, getQuantity(selectedProduct.id)))

      return newAttributes
    })
  }

  // Add this function after the handleAttributeSelect function

  const checkStockStatus = () => {
    // If no attributes are selected, return true (assume in stock)
    if (Object.keys(selectedAttributes).length === 0) return true

    // Check if any selected attribute has quantity 0
    const attributeValues = Object.values(selectedAttributes)

    // If we have a combination, check the combination quantity
    const hasCombination = attributeValues.some((attr) => attr.combinationId)

    if (hasCombination) {
      // All attributes in the same combination should have the same quantity
      // So we can check any of them
      return attributeValues[0].quantity > 0
    }

    // If no combination, check if any attribute is out of stock
    return attributeValues.every((attr) => attr.quantity > 0)
  }

  const CheckoutDirect = (product) => {
    if (!selectedProduct && !product) {
      console.error("No product found!");
      return;
    }
  
    const baseProduct = selectedProduct || product;
  
    // Validate attributes
    const validation = validateAttributes(baseProduct.product_attributes, selectedAttributes);
    if (!validation.isValid) {
      setLoading(false);
      const errorMessage = `Please select ${validation.missingAttributes.join(", ")}`;
      showToast(errorMessage, "error");
      setError([errorMessage]);
      return;
    }
  
    // Prepare attributeOptionId as a comma-separated string
    const attributeOptionIds = Object.values(selectedAttributes)
      .map((data) => data.id)
      .join(",");
  
    // Ensure items is an array
    const items = [{
      id: null,
      product_id: baseProduct.id,
      quantity: getQuantity(baseProduct.id) || 1,
      campaign_id: baseProduct.product_campaign ? baseProduct.product_campaign.campaign_id : null,
      discount_value: baseProduct.product_campaign ? baseProduct.product_campaign.campaign.discount : null,
      product: {
        id: baseProduct.id,
        product_name: baseProduct.product_name,
        free_delivary: baseProduct.is_free_shipping,
        price: calculatedPrice / getQuantity(baseProduct.id),
        featured_image: baseProduct.featured_image,
      },
      attributeOptionId: attributeOptionIds,
      attribute_values: Object.values(selectedAttributes).map((data) => data.id),
      attributes: Object.entries(selectedAttributes).map(([attributeId, data]) => ({
        attribute_id: Number.parseInt(attributeId, 10),
        attribute_option_id: data.attributeOptionId,
        attribute_name: data.attributeName,
        attribute_option: data.optionName,
        id: data.id,
      })),
    }];
  
    // Dispatch the direct order action
    dispatch(setDirectOrder(items));
  
    Navigate("/checkout");
  };
  

  const scrollThumbnails = (direction) => {
    if (thumbnailsRef.current) {
      const scrollAmount = thumbnailsRef.current.clientWidth
      thumbnailsRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    // When product page loads
    // dataLayer.trackProductView(selectedProduct, selectedAttributes)
    document.title = selectedProduct.product_name
    if (selectedProduct) {
      setCalculatedPrice(calculatePrice(selectedProduct, selectedAttributes, getQuantity(selectedProduct.id)))
    }
  }, [selectedProduct, selectedAttributes, quantities])

  useEffect(() => {
    const checkScrollability = () => {
      if (thumbnailsRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = thumbnailsRef.current

        // Check if scrolling is possible
        const isScrollable = scrollWidth > clientWidth

        // Determine arrow visibility
        setShowLeftArrow(isScrollable && scrollLeft > 0)
        setShowRightArrow(isScrollable && scrollLeft + clientWidth < scrollWidth)
      }
    }

    const thumbnailsElement = thumbnailsRef.current
    if (thumbnailsElement) {
      // Initial check
      checkScrollability()

      // Add scroll event listener
      thumbnailsElement.addEventListener("scroll", checkScrollability)

      // Add resize event listener
      window.addEventListener("resize", checkScrollability)

      // Cleanup
      return () => {
        thumbnailsElement.removeEventListener("scroll", checkScrollability)
        window.removeEventListener("resize", checkScrollability)
      }
    }
  }, [])

  function formatOldPrice(price) {
    if (price === null || price === undefined || price === "") return "" // Return empty string for null or empty values

    const formattedPrice = Number.parseFloat(price.toString().replace("Tk", "").trim()).toFixed(2)

    return formattedPrice.endsWith(".00") ? formattedPrice.slice(0, -3) : formattedPrice
  }

  return (
    <div>
      <style>{zoomStyles}</style>
      {selectedProduct && (
        <>
          <div className="row">
            <div className="col-lg-4">
              <div className="position-stacky">
                {/* Main Product Image Display */}
                <div
                  className="product productModal position-relative"
                  id="productModal"
                  ref={zoomContainerRef}
                  style={{
                    // height: productHeight,
                    transition: "height 0.3s ease-in-out",
                    overflow: "hidden",
                    cursor: isZooming ? "crosshair" : "default",
                  }}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  onMouseMove={(e) => {
                    if (!zoomContainerRef.current) return

                    const rect = zoomContainerRef.current.getBoundingClientRect()
                    const x = (e.clientX - rect.left) / rect.width
                    const y = (e.clientY - rect.top) / rect.height

                    // Constrain x and y to be between 0 and 1
                    const boundedX = Math.max(0, Math.min(1, x))
                    const boundedY = Math.max(0, Math.min(1, y))

                    setZoomPosition({
                      x: boundedX * 100,
                      y: boundedY * 100,
                    })
                  }}
                >
                  <img
                    src={getProductImages(selectedProduct)[activeIndex] || "/placeholder.svg"}
                    alt={selectedProduct.product_name}
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {isZooming && (
                    <div
                      className="zoom-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        ref={zoomImageRef}
                        src={getProductImages(selectedProduct)[activeIndex] || "/placeholder.svg"}
                        alt={selectedProduct.product_name}
                        style={{
                          position: "absolute",
                          width: "200%",
                          height: "200%",
                          objectFit: "cover",
                          left: `-${zoomPosition.x}%`,
                          top: `-${zoomPosition.y}%`,
                          pointerEvents: "none",
                          maxWidth: "none",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Product Thumbnails Navigation */}
                <div className="product-tools position-relative">
                  <div className="thumbnails-wrapper" style={{ position: "relative" }}>
                    {/* Left Arrow */}
                    {getProductImages(selectedProduct).length > 5 && (
                      <button
                        className="arrow left-arrow"
                        onClick={() => {
                          thumbnailsRef.current.scrollBy({
                            left: -100,
                            behavior: "smooth",
                          })
                        }}
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        &lt;
                      </button>
                    )}

                    <div
                      ref={thumbnailsRef}
                      className="thumbnails"
                      id="productModalThumbnails"
                      style={{
                        display: "flex",
                        overflowX: getProductImages(selectedProduct).length > 4 ? "auto" : "hidden",
                        gap: "10px",
                        scrollBehavior: "smooth",
                      }}
                    >
                      {getProductImages(selectedProduct).map((image, index) => (
                        <div
                          key={index}
                          className={`single-items ${index === activeIndex ? "tns-nav-active" : ""}`}
                          onClick={() => setActiveIndex(index)} // Update active image on click
                          style={{
                            minWidth: "80px", // Fixed width for thumbnails
                            maxWidth: "80px",
                            height: "80px",
                          }}
                        >
                          <div className="thumbnails-img">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${selectedProduct.product_name} ${index + 1}`}
                              className="ratio"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Arrow */}
                    {getProductImages(selectedProduct).length > 5 && (
                      <button
                        className="arrow right-arrow"
                        onClick={() => {
                          thumbnailsRef.current.scrollBy({
                            left: 100,
                            behavior: "smooth",
                          })
                        }}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        &gt;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="ps-lg-8 mt-6 mt-md-0 bg-white p-5 rounded-2">
                {/* {selectedProduct} */}

                <h1 className="mb-1">{selectedProduct.product_name}</h1>
                <div className="mb-4">
                  <small className="text-warning star_area">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </small>
                  {/* Replace the existing stock display with this: */}
                  <span
                    className={`ms-2 d-in-stack ${
                      Object.keys(selectedAttributes).length > 0
                        ? checkStockStatus()
                          ? "text-success"
                          : "text-danger"
                        : selectedProduct.quantity === 0
                          ? "text-danger"
                          : "text-success"
                    }`}
                  >
                    {Object.keys(selectedAttributes).length > 0
                      ? checkStockStatus()
                        ? "In Stock"
                        : "Stock Out"
                      : selectedProduct.quantity === 0
                        ? "Stock Out"
                        : "In Stock"}
                  </span>
                </div>
                {/* <div>
                  <p>
                    <strong>Product Code: </strong>
                    {selectedProduct.product_code}
                  </p>
                </div> */}
                <div className="details_price_area">
                  <div className="fw-bold text-dark d-flex">
                    <div className="oldPrice pr-2"><span className="currency">৳ </span> {formatOldPrice(selectedProduct.previous_price)} </div>{" "}
                    <div className="mainPrice">
                      <span className="currency">৳ </span> {calculatedPrice}
                    </div>
                  </div>
                  {selectedProduct.is_free_shipping == 1 && (
                    <div className="free_shipping">
                      <span>Free delivery</span>
                    </div>
                  )}
                  {selectedProduct.product_campaign && (
                    <>
                      <span className="text-decoration-line-through text-muted">৳{selectedProduct.price}</span>
                      <span>
                        <small className="fs-6 ms-2 text-danger">
                          Save {selectedProduct.product_campaign.campaign.discount}
                        </small>
                      </span>
                    </>
                  )}
                </div>

                <div className="summary mt-3">
                  <p>{selectedProduct.short_description}</p>
                </div>

                <hr className="my-6" />

                <div className="mt-5">
                  {/* <span>{JSON.stringify(selectedAttributes??[])}</span>  */}

                  {selectedProduct.product_attributes && selectedProduct.product_attributes.length > 0
                    ? // Group product attributes by attribute_id to ensure unique attributes
                      Object.values(
                        selectedProduct.product_attributes.reduce((acc, attribute) => {
                          // Check if this attribute_id already exists in the accumulator
                          if (!acc[attribute.attribute_id]) {
                            acc[attribute.attribute_id] = {
                              ...attribute,
                              options: [],
                            }
                          }
                          // Add unique attribute options to the corresponding attribute group
                          if (attribute.attribute_option) {
                            const isOptionUnique = acc[attribute.attribute_id].options.every(
                              (opt) => opt.id !== attribute.attribute_option.id,
                            )
                            if (isOptionUnique) {
                              acc[attribute.attribute_id].options.push({
                                ...attribute.attribute_option,
                                quantity: attribute.quantity,
                                price: attribute.price,
                                productAttributeId: attribute.id,
                              })
                            }
                          }
                          return acc
                        }, {}),
                      ).map((attribute) => (
                        <div key={attribute.attribute_id} className="mb-3">
                          <label className="form-label">{attribute.attribute?.name || "Attribute"}:</label>
                          <div className="d-flex gap-2 flex-wrap align-items-center">
                            {attribute.options && attribute.options.length > 0 ? (
                              attribute.options.map((option) => (
                                // In the attribute options mapping section, modify the button to show stock status:
                                <button
                                  key={option.id}
                                  type="button"
                                  className={`btn attrebute-button ${
                                    selectedAttributes[attribute.attribute_id]?.attributeOptionId === option.id
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttributeSelect(
                                      attribute.attribute_id,
                                      option.id,
                                      option.name,
                                      attribute.attribute.name,
                                      option.price,
                                      option.productAttributeId,
                                    )
                                  }
                                >
                                  {option.name}{" "}
                                  
                                </button>
                              ))
                            ) : (
                              <button type="button" className="btn btn-outline-secondary m-1 disabled">
                                No options available
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    : ""}
                  {/* <p>Calculated Price: {calculatedPrice}</p> */}
                  {/* <pre>{JSON.stringify(selectedAttributes, null, 2)}</pre> */}
                  {/* After the pre tag that shows the selected attributes JSON: */}
                  {Object.keys(selectedAttributes).length > 0 && (
                    <div className={`mt-2 fw-bold ${checkStockStatus() ? "text-success" : "text-danger"}`}>
                      Stock Status: {checkStockStatus() ? "In Stock" : "Out of Stock"}
                    </div>
                  )}
                </div>

                <div className="text-danger">{Error}</div>
                <div className="col-md-6 row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <div className="input-group input-spinner cart_area">
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="button-minus btn btn-sm mt-1"
                          onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                        >
                          <Minus />
                        </button>
                        <input
                          type="number"
                          className="quantity-field form-control-sm form-input mt-1"
                          value={quantities[selectedProduct.id] || 1} // Default to 1 if not set
                          readOnly
                        />
                        <button
                          type="button"
                          className="button-plus btn btn-sm mt-1"
                          onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                        >
                          <Plus />
                        </button>
                      </div>
                      <div className="add-to-cart-area">
                        <button
                          type="button"
                          className="btn btn-primary md-mx-2 md-mt-0 add-to-cart-btn"
                          style={{
                            background: "#000",
                            borderColor: "#000",
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                          }}
                          onClick={HandleAddToCart}
                          // Replace the disabled property on the Add to Cart button:
                          disabled={!checkStockStatus() || selectedProduct.quantity === 0}
                        >
                          <i className="feather-icon icon-shopping-bag me-2"></i>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="row">
                    <div className="col-xxl-12 col-lg-12 col-md-12 col-12 d-grid">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          background: "black",
                          borderColor: "black",
                        }}
                        onClick={CheckoutDirect}
                        // And on the Order Now button:
                        disabled={!checkStockStatus() || selectedProduct.quantity === 0} // Disable button if quantity is 0
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
                      <a
                        href={`tel:${siteinfos?.phone_number}`}
                        type="button"
                        className="btn btn-primary w-100"
                        style={{ backgroundColor: "black" }}
                      >
                        <i className="feather-icon icon-phone me-2"></i>
                        Call Now {siteinfos?.phone_number}
                      </a>
                    </div>
                    <div className="col-12">
                      <a
                        href={`https://wa.me/${siteinfos?.whatsapp_number}`}
                        type="button"
                        className="btn btn-primary w-100"
                        style={{ backgroundColor: "black" }}
                      >
                        <i className="bi bi-whatsapp me-2"></i>
                        WhatsApp {siteinfos?.whatsapp_number}
                      </a>
                    </div>
                  </div>
                </div>

                {/* add if condion */}
                {siteinfos?.attention_notice && (
                  <div className="mt-5">
                    <div className="attention_notice">
                      <p>{siteinfos?.attention_notice}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

