import React from "react";

export default function review() {
  return (
    <>
      <div className="my-8">
        <div className="row">
          <div className="col-md-4">
            <div className="me-lg-12 mb-6 mb-md-0">
              <div className="mb-5">
                <h4 className="mb-3">Customer reviews</h4>
                <span>
                  <small className="text-warning">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                  </small>
                  <span className="ms-3">4.1 out of 5</span>
                  <small className="ms-3">11,130 global ratings</small>
                </span>
              </div>
              <div className="mb-8">
                <div className="d-flex align-items-center mb-2">
                  <div className="text-nowrap me-3 text-muted">
                    <span className="d-inline-block align-middle text-muted">
                      5
                    </span>
                    <i className="bi bi-star-fill ms-1 small text-warning"></i>
                  </div>
                  <div className="w-100">
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "60%" }}
                        aria-valuenow="60"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <span className="text-muted ms-3">53%</span>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="text-nowrap me-3 text-muted">
                    <span className="d-inline-block align-middle text-muted">
                      4
                    </span>
                    <i className="bi bi-star-fill ms-1 small text-warning"></i>
                  </div>
                  <div className="w-100">
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "35%" }}
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="50"
                      ></div>
                    </div>
                  </div>
                  <span className="text-muted ms-3">22%</span>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="text-nowrap me-3 text-muted">
                    <span className="d-inline-block align-middle text-muted">
                      3
                    </span>
                    <i className="bi bi-star-fill ms-1 small text-warning"></i>
                  </div>
                  <div className="w-100">
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "35%" }}
                        aria-valuenow="35"
                        aria-valuemin="0"
                        aria-valuemax="35"
                      ></div>
                    </div>
                  </div>
                  <span className="text-muted ms-3">14%</span>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="text-nowrap me-3 text-muted">
                    <span className="d-inline-block align-middle text-muted">
                      2
                    </span>
                    <i className="bi bi-star-fill ms-1 small text-warning"></i>
                  </div>
                  <div className="w-100">
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "22%" }}
                        aria-valuenow="22"
                        aria-valuemin="0"
                        aria-valuemax="22"
                      ></div>
                    </div>
                  </div>
                  <span className="text-muted ms-3">5%</span>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="text-nowrap me-3 text-muted">
                    <span className="d-inline-block align-middle text-muted">
                      1
                    </span>
                    <i className="bi bi-star-fill ms-1 small text-warning"></i>
                  </div>
                  <div className="w-100">
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: "14%" }}
                        aria-valuenow="14"
                        aria-valuemin="0"
                        aria-valuemax="14"
                      ></div>
                    </div>
                  </div>
                  <span className="text-muted ms-3">7%</span>
                </div>
              </div>
              <div className="d-grid">
                <h4>Review this product</h4>
                <p className="mb-0">
                  Share your thoughts with other customers.
                </p>
                <a
                  href="#"
                  className="btn btn-outline-gray-400 mt-4 text-muted"
                >
                  Write the Review
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="mb-10">
              <div className="d-flex justify-content-between align-items-center mb-8">
                <div>
                  <h4>Reviews</h4>
                </div>
                <div>
                  <select className="form-select">
                    <option selected="">Top Reviews</option>
                    <option value="Most Recent">Most Recent</option>
                  </select>
                </div>
              </div>
              <div className="d-flex border-bottom pb-6 mb-6">
                <img
                  src="../assets/images/avatar/avatar-10.jpg"
                  alt=""
                  className="rounded-circle avatar-lg"
                />
                <div className="ms-5">
                  <h6 className="mb-1">Shankar Subbaraman</h6>

                  <p className="small">
                    <span className="text-muted">30 December 2022</span>
                    <span className="text-primary ms-3 fw-bold">
                      Verified Purchase
                    </span>
                  </p>

                  <div className="mb-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <span className="ms-3 text-dark fw-bold">
                      Need to recheck the weight at delivery point
                    </span>
                  </div>

                  <p>
                    Product quality is good. But, weight seemed less than 1kg.
                    Since it is being sent in open package, there is a
                    possibility of pilferage in between. FreshCart sends the
                    veggies and fruits through sealed plastic covers and Barcode
                    on the weight etc. .
                  </p>
                  <div>
                    <div className="border icon-shape icon-lg border-2">
                      <img
                        src="../assets/images/products/product-img-1.jpg"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="border icon-shape icon-lg border-2 ms-1">
                      <img
                        src="../assets/images/products/product-img-2.jpg"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="border icon-shape icon-lg border-2 ms-1">
                      <img
                        src="../assets/images/products/product-img-3.jpg"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <a href="#" className="text-muted">
                      <i className="feather-icon icon-thumbs-up me-1"></i>
                      Helpful
                    </a>
                    <a href="#" className="text-muted ms-4">
                      <i className="feather-icon icon-flag me-2"></i>
                      Report abuse
                    </a>
                  </div>
                </div>
              </div>
              <div className="d-flex border-bottom pb-6 mb-6 pt-4">
                <img
                  src="../assets/images/avatar/avatar-12.jpg"
                  alt=""
                  className="rounded-circle avatar-lg"
                />
                <div className="ms-5">
                  <h6 className="mb-1">Robert Thomas</h6>

                  <p className="small">
                    <span className="text-muted">29 December 2022</span>
                    <span className="text-primary ms-3 fw-bold">
                      Verified Purchase
                    </span>
                  </p>

                  <div className="mb-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star text-warning"></i>
                    <span className="ms-3 text-dark fw-bold">
                      Need to recheck the weight at delivery point
                    </span>
                  </div>

                  <p>
                    Product quality is good. But, weight seemed less than 1kg.
                    Since it is being sent in open package, there is a
                    possibility of pilferage in between. FreshCart sends the
                    veggies and fruits through sealed plastic covers and Barcode
                    on the weight etc. .
                  </p>

                  <div className="d-flex justify-content-end mt-4">
                    <a href="#" className="text-muted">
                      <i className="feather-icon icon-thumbs-up me-1"></i>
                      Helpful
                    </a>
                    <a href="#" className="text-muted ms-4">
                      <i className="feather-icon icon-flag me-2"></i>
                      Report abuse
                    </a>
                  </div>
                </div>
              </div>
              <div className="d-flex border-bottom pb-6 mb-6 pt-4">
                <img
                  src="../assets/images/avatar/avatar-9.jpg"
                  alt=""
                  className="rounded-circle avatar-lg"
                />
                <div className="ms-5">
                  <h6 className="mb-1">Barbara Tay</h6>

                  <p className="small">
                    <span className="text-muted">28 December 2022</span>
                    <span className="text-danger ms-3 fw-bold">
                      Unverified Purchase
                    </span>
                  </p>

                  <div className="mb-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star text-warning"></i>
                    <span className="ms-3 text-dark fw-bold">
                      Need to recheck the weight at delivery point
                    </span>
                  </div>

                  <p>
                    Everytime i ordered from fresh i got greenish yellow bananas
                    just like i wanted so go for it , its happens very rare that
                    u get over riped ones.
                  </p>

                  <div className="d-flex justify-content-end mt-4">
                    <a href="#" className="text-muted">
                      <i className="feather-icon icon-thumbs-up me-1"></i>
                      Helpful
                    </a>
                    <a href="#" className="text-muted ms-4">
                      <i className="feather-icon icon-flag me-2"></i>
                      Report abuse
                    </a>
                  </div>
                </div>
              </div>
              <div className="d-flex border-bottom pb-6 mb-6 pt-4">
                <img
                  src="../assets/images/avatar/avatar-8.jpg"
                  alt=""
                  className="rounded-circle avatar-lg"
                />
                <div className="ms-5 flex-grow-1">
                  <h6 className="mb-1">Sandra Langevin</h6>

                  <p className="small">
                    <span className="text-muted">8 December 2022</span>
                    <span className="text-danger ms-3 fw-bold">
                      Unverified Purchase
                    </span>
                  </p>

                  <div className="mb-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star text-warning"></i>
                    <span className="ms-3 text-dark fw-bold">
                      Great product
                    </span>
                  </div>

                  <p>Great product &amp; package. Delivery can be expedited.</p>

                  <div className="d-flex justify-content-end mt-4">
                    <a href="#" className="text-muted">
                      <i className="feather-icon icon-thumbs-up me-1"></i>
                      Helpful
                    </a>
                    <a href="#" className="text-muted ms-4">
                      <i className="feather-icon icon-flag me-2"></i>
                      Report abuse
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <a href="#" className="btn btn-outline-gray-400 text-muted">
                  Read More Reviews
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-5">Create Review</h3>
              <div className="border-bottom py-4 mb-4">
                <h4 className="mb-3">Overall rating</h4>
                <div
                  className="rater star-rating"
                  style={{
                    width: "100px",
                    height: "20px",
                    backgroundSize: "20px",
                  }}
                >
                  <div
                    className="star-value"
                    style={{ backgroundSize: "20px", width: "0px" }}
                  ></div>
                </div>
              </div>
              <div className="border-bottom py-4 mb-4">
                <h4 className="mb-0">Rate Features</h4>
                <div className="my-5">
                  <h5>Flavor</h5>
                  <div
                    className="rater star-rating"
                    style={{
                      width: "100px",
                      height: "20px",
                      backgroundSize: "20px",
                    }}
                  >
                    <div
                      className="star-value"
                      style={{ backgroundSize: "20px", width: "0px" }}
                    ></div>
                  </div>
                </div>
                <div className="my-5">
                  <h5>Value for money</h5>
                  <div
                    className="rater star-rating"
                    style={{
                      width: "100px",
                      height: "20px",
                      backgroundSize: "20px",
                    }}
                  >
                    <div
                      className="star-value"
                      style={{ backgroundSize: "20px", width: "0px" }}
                    ></div>
                  </div>
                </div>
                <div className="my-5">
                  <h5>Scent</h5>
                  <div
                    className="rater star-rating"
                    style={{
                      width: "100px",
                      height: "20px",
                      backgroundSize: "20px",
                    }}
                  >
                    <div
                      className="star-value"
                      style={{ backgroundSize: "20px", width: "0px" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border-bottom py-4 mb-4">
                <h5>Add a headline</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="What’s most important to know"
                />
              </div>
              <div className="border-bottom py-4 mb-4">
                <h5>Add a photo or video</h5>
                <p>
                  Shoppers find images and videos more helpful than text alone.
                </p>

                <div
                  id="my-dropzone"
                  className="dropzone mt-4 border-dashed rounded-2 min-h-0 dz-clickable"
                >
                  <div className="dz-default dz-message">
                    <button className="dz-button" type="button">
                      Drop files here to upload
                    </button>
                  </div>
                </div>
              </div>
              <div className="py-4 mb-4">
                <h5>Add a written review</h5>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="What did you like or dislike? What did you use this product for?"
                ></textarea>
              </div>

              <div className="d-flex justify-content-end">
                <a href="#" className="btn btn-primary">
                  Submit Review
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
