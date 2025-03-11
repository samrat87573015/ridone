import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../component/loader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Home() {
  const { productId } = useParams();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axiosInstance.post(`/template-product/all/`);
        setProductData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch product data');
        setLoading(false);
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading !=false) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  return (
  <>
  <Header/>
  <div className="bg-light min-vh-100">
      <section id="products" className="py-5">
        <div className="container">
          <h2 className="text-center text-danger mb-4">Our Latest Products</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {productData.map((product) => (
              <div key={product.id} className="col">
                <div className="card h-100 border-danger">
                  <div className="position-relative">
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">New</span>
                    <Link to={`/landingpage/${product.slug}`} className="d-block">
                      <img
                        src={product.featured_image}
                        alt={product.name}
                        className="card-img-top"
                      />
                    </Link>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link
                        to={`/landingpage/${product.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        {product.name}
                      </Link>
                    </h5>
                    <p className="card-text text-muted">TK {product.price}</p>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                    <Link
                      to={`/${product.slug}`}
                      className="btn btn-link text-danger text-decoration-none"
                    >
                      <i className="bi bi-eye"></i> View
                    </Link>
                    <button className="btn btn-danger">
                      <i className="bi bi-cart"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link
              to="#"
              className="btn btn-danger btn-lg"
            >
              More Products <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  <Footer/>
  </>
  );
}
