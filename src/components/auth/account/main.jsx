import React from "react";
import Sidebar from "./sidebar";
import Order from "./order";
export default function Main() {
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
              <Order />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
