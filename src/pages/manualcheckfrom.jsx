import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ManualRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    chassis_number: "",
    car_description: "",
    type: "USS", // Default to USS
    privacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // For success or error messages
  const [messageType, setMessageType] = useState(""); // To indicate "success" or "error"

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      privacy: e.target.checked,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axiosInstance
      .post("/manual-requests", formData)
      .then((response) => {
        setMessage(
          `ধন্যবাদ, ${response.data.name}! আপনার রিকোয়েস্টটি সফলভাবে জমা হয়েছে।`
        );
        setMessageType("success");
        setFormData({
          name: "",
          email: "",
          mobile_number: "",
          chassis_number: "",
          car_description: "",
          type: "USS",
          privacy: false,
        });
        setIsSubmitting(false);
      })
      .catch((error) => {
        const errors = error.response?.data?.errors || {};
        const errorMessages = Object.values(errors)
          .flat()
          .join(", ");
        setMessage(`ত্রুটি: ${errorMessages}`);
        setMessageType("error");
        setIsSubmitting(false);
      });
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      mobile_number: "",
      chassis_number: "",
      car_description: "",
      type: "USS",
      privacy: false,
    });
    setMessage(null);
    setMessageType("");
  };

  return (
    <div className="card bg-white text-danger p-4 shadow rounded">
      <div className="card-body">
        <div className="card p-4">
        <p>এই চেসিস নাম্বারের অকশন শীটটি Regular Auction সারভারে খুজে পাওয়া যায় নি !!</p>
        <p>চ্যাসিস নম্বর পাওয়া না গেলে বুঝতে হবে গাড়িটি USS অকশন হাউজের অথবা DEALER/ONE PRICE এ কেনা গাড়ি অথবা এই গাড়িটা কোন অকশনই হয় নাই। তাই এই গাড়ির অকশন শিট স্পেশাল রিকোয়েস্টের মাধ্যমে ভ্যারিফাই করতে হয়।</p>
        <p>এই চেসিস নাম্বারের গাড়িটি জাপানের ইউ.এস.এস (USS Auction) / ওয়ান প্রাইস (One Price) বা ডিলার অকশন (Dealer Auction) এর গাড়ি হলে আপনি ম্যানুয়াল রিকুয়েস্ট (Manual Request) দিতে পারেন।</p>
        <p>USS অকশন হাউজের গাড়ি ভ্যারিফাই করতে ৩৫০০ টাকা এবং DEALER/ONE PRICE এর জন্য ৫৫০০ টাকা পেমেন্ট করতে হবে। পেমেন্ট এর পর ৪৮ ঘন্টা সময়ের মধ্যে আমাদের সিস্টেম থেকে আপনি ইমেলের মাধ্যমে গাড়িটির অকশন গ্রেড, মাইলেজ, কালার ও অনান্য ইনফরমেশন রিপোর্ট টি পেয়ে যাবেন।</p>
        <p>The Auction Sheet of this Chassis Number is not available on the server. If this car is from the Japanese USS Auction / One Price or Dealer Auction you can send us a Manual Request. We will send you the original mileage, grade, color and other information by email within 48 hours.</p>

        </div>
        <h2 className="text-center text-danger mb-4">Manual Request Form</h2>
        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label">Your E-mail *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Insert Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label">Mobile Number *</label>
              <input
                type="text"
                name="mobile_number"
                className="form-control"
                placeholder="01XXXXXXXXX"
                value={formData.mobile_number}
                onChange={handleChange}
                maxLength={15}
                required
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label">Chassis Number *</label>
              <input
                type="text"
                name="chassis_number"
                className="form-control"
                placeholder="Chassis Number"
                value={formData.chassis_number}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </div>
            <div className="col-sm-12 mb-3">
              <label className="form-label">Car Description</label>
              <textarea
                name="car_description"
                className="form-control"
                placeholder="Year/Model/Color"
                value={formData.car_description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-sm-12 col-xs-12">
                  <label style={{ paddingTop: "5px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="type"
                      value="USS"
                      checked={formData.type === "USS"}
                      onChange={handleChange}
                      required
                    />
                    USS: 3500 Taka
                  </label>
                </div>
                <div className="col-sm-12 col-xs-12">
                  <label style={{ paddingTop: "5px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="type"
                      value="One Price / Dealer Stock"
                      checked={formData.type === "One Price / Dealer Stock"}
                      onChange={handleChange}
                      required
                    />
                    One Price / Dealer Stock: 5500 Taka
                  </label>
                </div>
                <div className="col-sm-12 col-xs-12">
                  <div className="checkbox">
                    <span
                      style={{
                        fontSize: "16px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      পেমেন্ট করার আগে ভালো করে জেনে নিন আপনার গাড়ির চেসিস নাম্বারটি USS কিনা। USS হলে 3500 টাকা পেমেন্ট করুন অথবা ডিলার হলে ৫৫০০ টাকা পেমেন্ট করুন। আপনি ভুল ইনপুট দিলে ম্যানুয়াল সার্চ করে ডাটা পাওনা না গেলে কোন রকম রিফান্ড দেওয়া হয় না।
                    </span>
                  </div>
                </div>
                <div className="col-sm-12 col-xs-12">
                  <div className="checkbox">
                    <label style={{ paddingTop: "5px", cursor: "pointer" }}>
                      <input
                        required
                        name="privacy"
                        type="checkbox"
                        checked={formData.privacy}
                        onChange={handleCheckboxChange}
                      />
                      <span style={{ fontSize: "13px" }}>I have read and agreed to the</span>
                    </label>
                    <a
                      target="_blank"
                      href="/auction-sheet-terms-condition"
                    >
                      <b>
                        <u>Terms &amp; Conditions</u>
                      </b>
                    </a>
                  </div>
                </div>
            <div className="col-sm-12">
              <div className="d-flex gap-3">
                <button type="reset" className="btn btn-secondary flex-grow-1">
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-danger flex-grow-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualRequestForm;
