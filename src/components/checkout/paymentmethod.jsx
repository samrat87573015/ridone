import React from 'react'

export default function Paymentmethod() {
  return (
    <>
    <div className="mt-5">
                <div>
                  <div className="card card-bordered shadow-none mb-2">
                    <div className="card-body p-6">
                      <div className="d-flex">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="paypal"
                          />
                          <label
                            className="form-check-label ms-2"
                            for="paypal"
                          ></label>
                        </div>
                        <div>
                          <h5 className="mb-1 h6">Payment with Paypal</h5>
                          <p className="mb-0 small">
                            You will be redirected to PayPal website to complete
                            your purchase securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card card-bordered shadow-none mb-2">
                    <div className="card-body p-6">
                      <div className="d-flex mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="creditdebitcard"
                          />
                          <label
                            className="form-check-label ms-2"
                            for="creditdebitcard"
                          ></label>
                        </div>
                        <div>
                          <h5 className="mb-1 h6">Credit / Debit Card</h5>
                          <p className="mb-0 small">
                            Safe money transfer using your bank accou k account.
                            We support Mastercard tercard, Visa, Discover and
                            Stripe.
                          </p>
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-12">
                          <div className="mb-3">
                            <label for="card-mask" className="form-label">
                              Card Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="card-mask"
                              placeholder="xxxx-xxxx-xxxx-xxxx"
                              required=""
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="mb-3 mb-lg-0">
                            <label className="form-label" for="nameoncard">
                              Name on card
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter name"
                              id="nameoncard"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-12">
                          <div className="mb-3 mb-lg-0 position-relative">
                            <label className="form-label" for="expirydate">
                              Expiry date
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="expirydate"
                              placeholder="MM/YY"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-12">
                          <div className="mb-3 mb-lg-0">
                            <label for="digit-mask" className="form-label">
                              CVV Code
                              <i
                                className="fe fe-help-circle ms-1"
                                data-placement="top"
                                aria-label="A 3 - digit number, typically printed on the back of a card."
                                data-bs-original-title="A 3 - digit number, typically printed on the back of a card."
                              ></i>
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              name="digit-mask"
                              id="digit-mask"
                              placeholder="xxx"
                              maxlength="3"
                              inputmode="numeric"
                              required=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card card-bordered shadow-none mb-2">
                    <div className="card-body p-6">
                      <div className="d-flex">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="payoneer"
                          />
                          <label
                            className="form-check-label ms-2"
                            for="payoneer"
                          ></label>
                        </div>
                        <div>
                          <h5 className="mb-1 h6">Pay with Payoneer</h5>
                          <p className="mb-0 small">
                            You will be redirected to Payoneer website to
                            complete your purchase securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card card-bordered shadow-none">
                    <div className="card-body p-6">
                      <div className="d-flex">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="cashonDelivery"
                          />
                          <label
                            className="form-check-label ms-2"
                            for="cashonDelivery"
                          ></label>
                        </div>
                        <div>
                          <h5 className="mb-1 h6">Cash on Delivery</h5>
                          <p className="mb-0 small">
                            Pay with cash when your order is delivered.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                 
                </div>
              </div>
    
    </>
  )
}
