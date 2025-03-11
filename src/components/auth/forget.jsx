import React from "react";
import { Link } from "react-router-dom";
import DynamicForm from "../DynamicForm";

export default function Forget() {
  const fields = {
    formForgetEmail: {
      label: "Email Address",
      type: "email",
      placeholder: "Email",
      required: true,
      columnClassName: "col-12",
      className: "form-control",
      hideLabel: true, // To hide the label and keep the placeholder visible
    },
  };

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    // Add logic for password reset (e.g., API call)
  };

  return (
    <section className="my-lg-14 my-8">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 d-flex align-items-center">
            <div>
              <div className="mb-lg-9 mb-5 text-center">
                <h1 className="mb-2 h2 fw-bold">Forgot your password?</h1>
                <p>
                  Please enter the email address associated with your account
                  and We will email you a link to reset your password.
                </p>
              </div>

              <DynamicForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText="Reset Password"
                className="needs-validation"
                buttonWrapperClassName="col-12 d-grid gap-2"
                extraContent={
                  <Link to="/signin" className="btn btn-light">
                    Back
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
