import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../../api/homeservice";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function FeatureCategories() {
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  // Get categories from Redux store
  const categories = useSelector((state) => state.home.categories.slice(0, 12));
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  // Fetch categories once when component mounts
  useEffect(() => {
    if (categories.length === 0) {
      // dispatch(fetchHomeData());
    }
  }, [categories.length]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  function formatPrice(price) {
    const formattedPrice = parseFloat(
      price.toString().replace("Tk", "")
    ).toFixed(2); // Remove 'Tk' and ensure numeric format
    return formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3) // Remove .00 if present
      : formattedPrice;
  }

  return (
    <>
      <section className="mb-lg-10 mt-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
              <h3 className="mb-0">Products Categories</h3>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="category-slider-container position-relative">
              {/* Custom Navigation Buttons */}
              <button className="categories-prev sliderArrowPrev">❮</button>
              <button className="categories-next sliderArrowNext">❯</button>

              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={2}
                navigation={{
                  prevEl: ".categories-prev",
                  nextEl: ".categories-next",
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  576: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  992: { slidesPerView: 4, spaceBetween: 20 },
                  1200: { slidesPerView: 4, spaceBetween: 20 },
                  1400: { slidesPerView: 4, spaceBetween: 20 },
                }}
                className="category-swiper"
              >
                {categories.map((ctg) => (
                  <SwiperSlide key={ctg.id} className="cat-swiper-slide">
                    <Link
                      to={`/filter?category=${ctg.slug}`}
                      className="text-decoration-none text-reset"
                    >
                      <div className="category-card d-flex flex-column align-items-center">
                        {/* Circle Icon */}
                        <div className="category-icon">
                          <img
                            src={ctg?.image || "/placeholder.svg"}
                            alt={ctg?.name}
                            className="img-fluid"
                          />
                        </div>

                        {/* Category Name Button */}
                        <div className="category-name">{ctg?.name}</div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
