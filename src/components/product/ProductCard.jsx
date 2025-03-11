import { Link } from "react-router-dom";


const ProductCard = ({ product, handleQuickView }) => {
  return (
    <div className="single-items product_card" key={product.id}>
      <div className=" golobal-product overflow-hidden">
        <div className="product-card-body">
          {/* Product Image */}
          <div className="position-relative product_image ">
            <Link
              to={`/product/${product.slug}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                src={
                  product.featured_image ||
                  "assets/images/products/product-placeholder.png"
                }
                alt={product.product_name}
                className="img-fluid"
              />
            </Link>

            {/* Display out of stock badge */}
            {product.quantity == 0 && (
              <div className="outofstockbage">
                <div className="signoftk">Out of stock</div>
              </div>
            )}
            {/* Check for product campaign and display discount */}
            {product?.product_campaign && (
              <div className="position-absolute top-0 start-0 z-2">
                <span className="d-flex badge bg-danger">
                  <div className="signoftk">Save ৳</div>
                  {product.product_campaign.campaign.discount}
                </span>
              </div>
            )}

          </div>
          <div className="product-card-content">
            {/* Product Name */}
            <h4 className="product_title mt-3 fw-semibold text-dark">
              {product.product_name}
            </h4>

            {/* Price Display */}
            <div className="price text-dark fw-semibold mb-3">
              ৳ {product.price}
            </div>

            {/* Add to Cart Button */}
            <button
              className="btn add_to_cart_btn py-2 rounded"
              onClick={() => handleQuickView(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
