import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import Productmodel from "./productmodel";
import Detailstab from "./detailstab";
import RelatedProduct from "./related";
import { fetchHomeData } from "../../api/homeservice";

const Product = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  // Redux state
  const products = useSelector((state) => state.home.products);
  const siteinfos = useSelector((state) => state.home.siteinfos[0]);
  const error = useSelector((state) => state.home.error);
  const loading = useSelector((state) => state.home.loading);

  // Local state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("product");

  // Fetch product data when component mounts
  const fetchProductData = useCallback(() => {
    if (!products || products.length === 0) {
      dispatch(fetchHomeData());
    }
  }, [dispatch, products]);

  useEffect(() => {
    document.title=siteinfos?.product_page_title || 'React app by softexel';
    setLoading(loading);
    fetchProductData();
  }, [fetchProductData, loading, setLoading]);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p.slug === slug);
      const related = products.filter(
        (p) =>
          p.category_id === foundProduct?.category_id && // Same category
          p.slug !== slug // Exclude the current product
      );

      setSelectedProduct(foundProduct || null);
      setRelatedProducts(related);
    }
  }, [products, slug]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  // Tabs
  const tabs = [
    { id: "product", label: "Product Details" },
    // { id: "details", label: "Information" },
    // { id: "reviews", label: "Reviews" },
  ];

  return (
    <>
      {/* Breadcrumb Navigation */}
      {/* <div className="mt-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Product</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {slug}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div> */}

      {selectedProduct ? (
        <>
          {/* Product Section */}
          <section className="mt-8 single-product-viewpage">
            <div className="container">
              <div className="row">
                <Productmodel selectedProduct={selectedProduct} />
              </div>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="mt-lg-14 mt-8">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
             
                  <ul className="nav nav-pills nav-lb-tab" role="tablist">
                    {tabs.map((tab) => (
                      <li key={tab.id} className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                          onClick={() => setActiveTab(tab.id)}
                          role="tab"
                          aria-selected={activeTab === tab.id}
                          aria-controls={`${tab.id}-tab-pane`}
                        >
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>

             
                  <div className="tab-content" id="myTabContent">
                
                    <div
                      className={`tab-pane fade ${
                        activeTab === "product" ? "show active" : ""
                      }`}
                      role="tabpanel"
                      aria-labelledby="product-tab"
                    >
                      <div className="my-8 bg-white p-5 rounded-2">
                        {/* <div className="mb-5">
                          {selectedProduct?.short_description && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: selectedProduct.short_description,
                              }}
                            />
                          )}
                        </div> */}
                        <div className="mb-5">
                          {selectedProduct?.description && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: selectedProduct.description,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                 
                    <div
                      className={`tab-pane fade ${
                        activeTab === "details" ? "show active" : ""
                      }`}
                      role="tabpanel"
                      aria-labelledby="details-tab"
                    >
                      <Detailstab specifications={selectedProduct?.specification} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Products Section */}
          <RelatedProduct ProductData={relatedProducts} />
        </>
      ) : (
        <div className="container mt-8">
          <div className="row">
            <div className="col-12 text-center">
              <h2>No product found</h2>
              <p>It seems like the product you're looking for is not available.</p>
              <Link to="/" className="btn btn-primary">
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
