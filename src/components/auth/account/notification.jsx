import React from "react";
import Sidebar from "./sidebar";
import Order from "./order";
export default function Notification() {
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
                  <h2 className="mb-0">Notification settings</h2>
                </div>

                <div className="mb-10">
                  <div className="border-bottom pb-3 mb-5">
                    <h5 className="mb-0">Email Notifications</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-6">
                    <div>
                      <h6 className="mb-1">Weekly Notification</h6>
                      <p className="mb-0">
                        Various versions have evolved over the years, sometimes
                        by accident, sometimes on purpose .
                      </p>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckDefault"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Account Summary</h6>
                      <p className="mb-0 pe-12">
                        Pellentesque habitant morbi tristique senectus et netus
                        et malesuada fames ac turpis eguris eu sollicitudin
                        massa. Nulla ipsum odio, aliquam in odio et, fermentum
                        blandit nulla.
                      </p>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked=""
                      />
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="mb-10">
                  <div className="border-bottom pb-3 mb-5">
                    <h5 className="mb-0">Order updates</h5>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-6">
                    <div>
                      <h6 className="mb-0">Text messages</h6>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault2"
                      />
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckDefault2"
                      ></label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Call before checkout</h6>
                      <p className="mb-0">
                        We'll only call if there are pending changes
                      </p>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked2"
                        checked=""
                      />
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked2"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="border-bottom pb-3 mb-5">
                    <h5 className="mb-0">Website Notification</h5>
                  </div>
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckFollower"
                        checked=""
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckFollower"
                      >
                        New Follower
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckPost"
                      />
                      <label className="form-check-label" for="flexCheckPost">
                        Post Like
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckPosted"
                      />
                      <label className="form-check-label" for="flexCheckPosted">
                        Someone you followed posted
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCollection"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckCollection"
                      >
                        Post added to collection
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckOrder"
                      />
                      <label className="form-check-label" for="flexCheckOrder">
                        Order Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
