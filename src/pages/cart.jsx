import React from "react";
import Lists from "../components/cart/list";
import Summary from "../components/cart/summary";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function Cart() {
  return (
    <>
      <Header />
      <div className="mt-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#!">Shop</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Shop Cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <section className="mb-lg-14 mb-8 mt-8">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card py-1 border-0 mb-8">
                <div>
                  <h1 className="fw-bold">Shop Cart</h1>
                  <p className="mb-0">Shopping in 382480</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <Lists />
            <Summary />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
