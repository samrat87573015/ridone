import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";


const CarDealerLeadForm = () => {

  const siteinfos = useSelector(state => state.home.siteinfos[0])

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    car_name: "",
    car_model: "",
    pakage: "",
    car_color: "",
    car_milas: "",
    car_hibredorNot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await axiosInstance.post("/car/lead", formData);
      setSubmitMessage("ফর্মটি সফলভাবে জমা দেওয়া হয়েছে!");
      setFormData({
        name: "",
        phone: "",
        car_name: "",
        car_model: "",
        pakage: "",
        car_color: "",
        car_milas: "",
        car_hibredorNot: "",
      });
    } catch (error) {
      setSubmitMessage(
        "দুঃখিত, একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceItems = [
    { icon: '../assets/images/icons/s1.png', colorText: "ফ্রী", title: "টায়ার ইনফ্লেক্টার" },
    { icon: '../assets/images/icons/s2.png', colorText: "ফ্রী", title: "ড্যাশ ক্যামেরা" },
    { icon: '../assets/images/icons/s3.png', colorText: "ফ্রী", title: "স্পেয়ার রিমোট" },
    { icon: '../assets/images/icons/s4.png', colorText: "ফ্রী", title: "স্পেয়ার টায়ার" },
    { icon: '../assets/images/icons/s5.png', colorText: "ফ্রী", title: "ইঞ্জিন ওয়েল ও ফিল্টার ৩ সেট" },
    { icon: '../assets/images/icons/s6.png', colorText: "এক", title: "বছরের গ্যারান্টি ইঞ্জিন ও গিয়ার বক্স" },
    { icon: '../assets/images/icons/s7.png', colorText: "দুই", title: "বছরের গ্যারান্টি হাইব্রিড ব্যাটারি" },
    { icon: '../assets/images/icons/s8.png', colorText: "ফ্রী", title: "ইলেকট্রিক ব্যাক ম্যাসাজ কুশন" },
  ];

  return (
    <div className="car-lead-form">
      {/* <pre>{JSON.stringify(siteinfos, null, 2)}</pre> */}
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h2 className="section_title"><strong>রাইড অন</strong> থেকে গাড়ি <strong>প্রি-অর্ডার</strong> করলে<br />
          আপনি নিচে উল্লেখিত ৮টি সুবিধা পাবেন।</h2>
        </div>

        {/* Service Icons Grid */}
        <div className="row service_item_wrapp mb-5">
          {serviceItems.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <div className="col-service">
                <div className="service-item text-center">
                  <div
                    className="service-icon"
                  >
                    <img src={item.icon} alt={item.title} />
                    
                  </div>
                  <p className="service-title" ><span className="color_text">{item.colorText}</span> {item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Section Header */}
        <div className="car-form-header text-center mb-4">
          <h3 className="section_title">আপনার <strong>পছন্দের</strong> গাড়ির <strong>সঠিক দাম</strong> <br /> জানাতে নিচের ফরমটি পূরণ করুন।</h3>
        </div>

        {/* Form Card */}
        <div className="row justify-content-center form-card-area">
          <div className="col-12">
            <div className="card border-0">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 gy-10">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        আপনার নাম
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="আপনার পূর্ণ নাম"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        আপনার মোবাইল নম্বর
                      </label>
                      <input
                        type="tel"
                        className="form-control car-form-input"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="উদাহরণ - ০১৭০০-০০০০০০"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="car_name" className="form-label">
                        পছন্দের গাড়ির নাম
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="car_name"
                        name="car_name"
                        value={formData.car_name}
                        onChange={handleChange}
                        placeholder="উদাহরণ - টয়োটা"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="car_model" className="form-label">
                        পছন্দের গাড়ির মডেল
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="car_model"
                        name="car_model"
                        value={formData.car_model}
                        onChange={handleChange}
                        placeholder="উদাহরণ - টয়োটা প্রিয়াস"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="pakage" className="form-label">
                        পছন্দের গাড়ির প্যাকেজ
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="pakage"
                        name="pakage"
                        value={formData.pakage}
                        onChange={handleChange}
                        placeholder="উদাহরণ - এল"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="car_color" className="form-label">
                        পছন্দের গাড়ির রং
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="car_color"
                        name="car_color"
                        value={formData.car_color}
                        onChange={handleChange}
                        placeholder="উদাহরণ - পার্ল"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="car_milas" className="form-label">
                      পছন্দের গাড়ির মাইলেজ
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="car_milas"
                        name="car_milas"
                        value={formData.car_milas}
                        onChange={handleChange}
                        placeholder="উদাহরণ - ২০০০০ কিমি"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="car_hibredorNot" className="form-label">
                      হাইব্রিড / নন-হাইব্রিড
                      </label>
                      <input
                        type="text"
                        className="form-control car-form-input"
                        id="car_hibredorNot"
                        name="car_hibredorNot"
                        value={formData.car_hibredorNot}
                        onChange={handleChange}
                        placeholder="উদাহরণ - নন-হাইব্রিড"
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn lead_submit_btn w-100"
                        style={{ backgroundColor: "#E25E00", color: "white" }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            জমা দেওয়া হচ্ছে...
                          </>
                        ) : (
                          "সাবমিট করুন"
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {submitMessage && (
                  <div
                    className={`alert ${
                      submitMessage.includes("সফলভাবে")
                        ? "alert-success"
                        : "alert-danger"
                    } mt-3`}
                    role="alert"
                  >
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Contact Button */}
        <div className="row justify-content-center mt-4">
          <div className="col-12">
            <div className="text-center mb-2">
              <h3 className="" style={{ 
                fontSize: "1.5rem",
                color: "#000",
                fontWeight: "bold",
                padding: "20px"
               }}>বিস্তারিত জানাতে</h3>
            </div>
            <a 
              href={`https://wa.me/${siteinfos?.whatsapp_number}`}
              className="btn w-100 py-5 d-flex justify-content-center align-items-center"
              style={{ backgroundColor: "#004407", color: "white" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-whatsapp me-2"
                viewBox="0 0 16 16"
              >
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
              </svg>
              হোয়াটসঅ্যাপ করুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDealerLeadForm;
