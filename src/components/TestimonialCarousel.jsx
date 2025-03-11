import React, { useEffect } from "react";
import ReactSlider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../components/LoadingContext";
import { useToast } from "../components/ToastContext";


const TestimonialCarousel = () => {
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  const testimonials = useSelector((state) => state.home.testimonials);
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  useEffect(() => {
    // if (testimonials.length === 0) {
    //   dispatch(fetchTestimonials());
    // }
  }, [dispatch, testimonials.length]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
   <>
   {testimonials.length > 1 ?<>
    <section className="testmonial mt-5 container mx-auto px-4">
      <ReactSlider {...sliderSettings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-4">
            <div className="singletestomonial d-flex bg-white shadow-lg rounded-lg p-6 col-md-12">
              <div className="image col-md-6">
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              )}
              </div>
              <div className="content col-md-6 p-5">
                    <h3 className="text-gray-700">{testimonial.content}</h3>
                    <p className="mt-4 font-semibold text-gray-900">
                        - {testimonial.author}
                    </p>
              </div>
            </div>
          </div>
        ))}
      </ReactSlider>
    </section>
   </>
   :
   <section className="testmonial mt-5 container mx-auto px-4">
      <ReactSlider {...sliderSettings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-4">
            <div className="singletestomonial d-flex bg-white shadow-lg rounded-lg p-6 col-md-12">
              <div className="image col-md-6">
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              )}
              </div>
              <div className="content col-md-6 p-5">
                    <h3 className="text-gray-700">{testimonial.content}</h3>
                    <p className="mt-4 font-semibold text-gray-900">
                        - {testimonial.author}
                    </p>
              </div>
            </div>
          </div>
        ))}
      </ReactSlider>
    </section>
   }
 

     
   </>
  );
};

export default TestimonialCarousel;