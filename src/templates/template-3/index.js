import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import VideoPlayer from "../../component/VideoPlayer";
import VideoThumbnail from "../../component/VideoThumbnail";
import Landingorder from "../../components/checkout/landingorder";
import { Shield, Truck, Headphones, Phone, Mail, MapPin } from "lucide-react"
import { ChevronDown, ChevronUp } from "lucide-react"
function App({ productData, Setting }) {
  const [isLoading, setIsLoading] = useState(true); 
  const [openIndex, setOpenIndex] = useState();

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  
  // Safely parse JSON data with error handling
  const parseJsonData = (jsonString, defaultValue = []) => {
    try {
      return JSON.parse(jsonString || JSON.stringify(defaultValue));
    } catch (error) {
      console.error("JSON parsing error:", error);
      return defaultValue;
    }
  };

  const faqQuestions = parseJsonData(productData?.faq_questions);
  const faqAnswers = parseJsonData(productData?.faq_answers);
  const reviewImages = parseJsonData(productData?.review_images);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        // Simulate waiting for resources to load
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (error) {
        console.error("Loading error:", error);
        setIsLoading(false);
      }
    };

    loadComponents();
  }, []);

  const scrollToOrder = (e) => {
    e.preventDefault();
    const orderSection = document.querySelector('.order-from');
    orderSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-success">পেজটি লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white template-3">
      {/* Header */}
      <header className="text-center py-4" style={{background:'#effcff'}}>
        <h1 className="text-success fw-semibold fs-4 mb-2 product-title">
          {productData?.name || 'Product Name'}
        </h1>
        <span className="border border-success rounded-pill px-3 py-1 d-inline-block product-subname">
          <small>{productData?.header_title || 'Product Title'}</small>
        </span>
      </header>

      {/* Video Section */}
      <section className="video-section" style={{background:'#effcff'}}>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-8">
            <VideoPlayer
              thumbnailUrl={productData?.featured_image}
              videoUrl={productData?.video_url}
              title={productData?.name}
            />
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="text-center py-4 price-section" style={{background:'#effcff'}}>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <i className="fas fa-check text-success"></i>
          <span className="fs-4">মূল্যঃ {productData?.price || '0'} টাকা</span>
        </div>
        <p className="text-success mt-2">১টির বেশি অর্ডার করলে ফ্রি ডেলিভারি</p>
      </section>

      {/* Order Form */}
      <section className="container py-5 order-from" id="orderSection">
        <Landingorder 
          item={productData?.product} 
        />
      </section>

      {/* Features */}
      <section className="py-5 features">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-8">
            <h3 className="text-center fw-semibold mb-4">মূল্যবান নির্দেশ বিবরণ ব্যবহারের সুবিধা</h3>
            <div className="mb-4 maincontent">
              <div dangerouslySetInnerHTML={{ 
                __html: productData?.product_description || '' 
              }} />
            </div>
            <div className="text-center">
              <button 
                className="btn btn-success"
                onClick={scrollToOrder}
              >
                অর্ডার করুন এখন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-5 faq-section">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <h3 className="text-center fw-semibold mb-4">{productData?.faq_section_title || "সচরাচর জিজ্ঞাসা"}</h3>
          <div className="accordion">
            {faqQuestions.map((question, i) => (
              <div key={i} className="card mb-2">
                <div className="card-header bg-white">
                  <button
                    className="btn btn-link text-danger text-decoration-none w-100 text-start d-flex justify-content-between align-items-center"
                    type="button"
                    onClick={() => toggleQuestion(i)}
                  >
                    <span className="fw-bold " style={{fontSize:'17px'}}>{question}</span>
                    {openIndex === i ? (
                      <ChevronUp className="text-danger" size={20} />
                    ) : (
                      <ChevronDown className="text-danger" size={20} />
                    )}
                  </button>
                </div>
                {openIndex === i && <div className="card-body">{faqAnswers[i]}</div>}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-success" onClick={scrollToOrder}>
              অর্ডার করুন এখন
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* Review Gallery */}
      <section className="container py-5 review-gallary">
        <h3 className="text-center fw-semibold mb-4">কাস্টমার রিভিউ</h3>
        <div className="container">
          <div className="row g-4">
            {reviewImages.map((imgUrl, i) => (
              <div key={i} className="col-12 col-md-4">
                <VideoThumbnail thumbnailUrl={imgUrl} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
          <button 
            className="btn btn-success"
            onClick={scrollToOrder}
          >
            অর্ডার করুন এখন
          </button>
        </div>
      </section>

    {/* Why Choose Us Section */}
    <section className="container py-5 why-us">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-8">
            <h3 className="text-center fw-semibold mb-4">কেন আমাদের বেছে নেবেন</h3>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Shield className="text-white" size={40} />
                    </div>
                    <h4 className="fs-5 mb-2">প্রিমিয়াম কোয়ালিটি</h4>
                    <p className="text-muted mb-0">সর্বোচ্চ মানের পণ্য নিশ্চিত করা হয়</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Truck className="text-white" size={40} />
                    </div>
                    <h4 className="fs-5 mb-2">দ্রুত ডেলিভারি</h4>
                    <p className="text-muted mb-0">সারা দেশে দ্রুত ডেলিভারি সেবা</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Headphones className="text-white" size={40} />
                    </div>
                    <h4 className="fs-5 mb-2">২৪/৭ সাপোর্ট</h4>
                    <p className="text-muted mb-0">সব সময় গ্রাহক সহায়তা</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-5 contact-us">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-8">
            <h3 className="text-center fw-semibold mb-4">যোগাযোগ করুন</h3>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Phone className="text-white" size={40} />
                    </div>
                    <h4 className="fs-5 mb-2">ফোন নম্বর</h4>
                    <a href={`tel:${Setting?.phone || "01799-358181"}`} className="text-success text-decoration-none">
                      {Setting?.phone || "01799-358181"}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Mail className="text-white" size={40} />
                    </div>
                    <h4 className="fs-5 mb-2">ইমেইল</h4>
                    <a
                      href={`mailto:${Setting?.email || "support@example.com"}`}
                      className="text-success text-decoration-none"
                    >
                      {Setting?.email || "support@example.com"}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-success bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <MapPin className="text-white" size={40} />
                    </div>
                    <h4 className="fs-5 mb-2">ঠিকানা</h4>
                    <p className="text-muted mb-0">{Setting?.address || "মিরপুর-১০, ঢাকা-১২১৬"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black py-8" style={{background:'rgb(0 0 0) !important'}}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center text-center">
            <div className="small m-auto">Privacy and Policy · Terms and Conditions</div>
          </div>
          <div className="d-flex justify-content-between align-items-center text-center">
            <div className="small m-auto" style={{color:'#e5e5e5'}}>©2024 Rideon.com.bd</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;