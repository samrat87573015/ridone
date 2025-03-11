import React, { useState } from "react";
import Sidebar from "./sidebar";
import DynamicForm from "../../DynamicForm";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateuser,
  changePassword,
  deleteAccount,
} from "../../../api/store/slices/userSlice";
import { useToast } from "../../ToastContext";
 
export default function Setting() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { showToast } = useToast();
  const settingsFields = {
    name: {
      type: "text",
      label: "Name",
      placeholder: "Enter your name",
      required: true,
      value: user?.name || "",
    },
    email: {
      type: "email",
      label: "Email",
      placeholder: "Enter your email",
      required: true,
      value: user?.email || "",
    },
    phone: {
      type: "text",
      label: "Phone",
      placeholder: "Phone number",
      required: false,
      value: user?.phone || "",
    },
    image: {
      type: "file",
      label: "Profile Image",
      accept: "image/*",
      required: false,
      value: user?.image || "", // This will show the current image
    },
  };

  const passwordChangeFields = {
    current_password: {
      type: "password",
      label: "Current Password",
      placeholder: "**********",
      required: true,
    },
    new_password: {
      type: "password",
      label: "New Password",
      placeholder: "**********",
      required: true,
    },
    new_password_confirmation: {
      type: "password",
      label: "Retype New Password",
      placeholder: "**********",
      required: true,
    },
  };

  return (
    <main>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center d-md-none py-4">
                <h3 className="fs-5 mb-0">Account Setting</h3>
                <button
                  className="btn btn-outline-gray-400 text-muted d-md-none btn-icon btn-sm ms-3"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasAccount"
                  aria-controls="offcanvasAccount"
                >
                  <i className="bi bi-text-indent-left fs-3"></i>
                </button>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-10 pe-lg-10">
                <Sidebar />
              </div>
            </div>

            <div className="col-lg-9 col-md-8 col-12">
              <div className="py-6 p-md-6 p-lg-10">
                <div className="mb-6">
                  <h2 className="mb-0">Account Setting</h2>
                </div>

                {/* Profile Update */}
                <div>
                  <h1>Welcome, {user?.name || "User"}!</h1>
                  <h5 className="mb-4">Account details</h5>
                  <div className="row">
                    <div className="col-lg-5">
                      <DynamicForm
                        fields={settingsFields}
                        onSubmit={(formData) => {
                          dispatch(updateuser(formData))
                            .unwrap()
                            .then(() => showToast("Profile updated successfully!",'success') )
                            .catch((error) => { showToast(error?.message,'error') });
                        }}
                        submitButtonText="Save Details"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-10" />

                {/* Password Change */}
                <div className="pe-lg-14">
                  <h5 className="mb-4">Password</h5>
                  <DynamicForm
                    fields={passwordChangeFields}
                    onSubmit={(data) => {
                      if (data.newPassword === data.currentPassword) {
                        alert(
                          "New password cannot be the same as the current password."
                        );
                        return;
                      }
                      dispatch(changePassword(data))
                        .unwrap()
                        .then(() => showToast("Password updated successfully!",'success') )
                        .catch((error) => { showToast(error?.message,'error') });
                    }}
                    submitButtonText="Save Password"
                    extraContent={
                      <div className="col-12">
                        <p className="mb-4">
                          Can't remember your current password?{" "}
                          <Link to="/reset-password">Reset your password.</Link>
                        </p>
                      </div>
                    }
                  />
                </div>

                <hr className="my-10" />

                {/* Delete Account */}
                <div>
                  <h5 className="mb-4">Delete Account</h5>
                  <p className="mb-2">Would you like to delete your account?</p>
                  <p className="mb-5">
                    This account contains 12 orders. Deleting your account will
                    remove all the order details associated with it.
                  </p>
                  <a
                    href="#"
                    className="btn btn-outline-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          "Are you sure you want to delete your account?"
                        )
                      ) {
                        dispatch(deleteAccount())
                          .unwrap()
                          .then(() => showToast("Account deleted successfully.",'success') )
                          .catch((error) => { showToast(error?.message,'error') });
                        
                      }
                    }}
                  >
                    I want to delete my account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
