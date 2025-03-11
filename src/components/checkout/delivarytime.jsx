import React from 'react'

export default function Delivarytime() {
  return (
    <>
    <ul
                className="nav nav-pills nav-pills-light mb-3 nav-fill mt-5"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-today-tab"
                    type="button"
                    role="tab"aria-selected="true"
                  >
                    Today
                    <br />
                    <small>Oct 3</small>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-monday-tab"
                    type="button"
                    role="tab"aria-selected="false"
                    tabindex="-1"
                  >
                    Mon
                    <br />
                    <small>Oct 4</small>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-Tue-tab"
                    type="button"
                    role="tab"aria-selected="false"
                    tabindex="-1"
                  >
                    Tue
                    <br />
                    <small>Oct 5</small>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-Wed-tab"
                    type="button"
                    role="tab"aria-selected="false"
                    tabindex="-1"
                  >
                    Wed
                    <br />
                    <small>Oct 6</small>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-Thu-tab"
                    type="button"
                    role="tab"aria-selected="false"
                    tabindex="-1"
                  >
                    Thu
                    <br />
                    <small>Oct 7</small>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-Fri-tab"
                    type="button"
                    role="tab"aria-selected="false"
                    tabindex="-1"
                  >
                    Fri
                    <br />
                    <small>Oct 8</small>
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-Sat-tab"
                    type="button"
                    role="tab"aria-selected="false"
                    tabindex="-1"
                  >
                    Sat
                    <br />
                    <small>Oct 9</small>
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade active show"
                  id="pills-today"
                  role="tabpanel"
                  aria-labelledby="pills-today-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault1"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>

                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault2"
                          >
                            <span>Within 3 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault3"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault3"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault4"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault4"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>

                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault5"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault5"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>

                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-monday"
                  role="tabpanel"
                  aria-labelledby="pills-monday-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault6"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault6"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault7"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault7"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault8"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault8"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault9"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault9"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault10"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault10"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-Tue"
                  role="tabpanel"
                  aria-labelledby="pills-Tue-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault11"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault11"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault12"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault12"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault13"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault13"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault14"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault14"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault15"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault15"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-Wed"
                  role="tabpanel"
                  aria-labelledby="pills-Wed-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault16"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault16"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault17"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault17"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault18"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault18"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault19"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault19"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault20"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault20"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-Thu"
                  role="tabpanel"
                  aria-labelledby="pills-Thu-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault21"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault21"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault22"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault22"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>

                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault23"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault23"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault24"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault24"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault25"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault25"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-Fri"
                  role="tabpanel"
                  aria-labelledby="pills-Fri-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault26"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault26"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault27"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault27"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault28"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault28"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault29"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault29"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault30"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault30"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-Sat"
                  role="tabpanel"
                  aria-labelledby="pills-Sat-tab"
                  tabindex="0"
                >
                  <ul className="list-group list-group-flush mt-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault31"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault31"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault32"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault32"
                          >
                            <span>Within 2 Hours</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault33"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault33"
                          >
                            <span>1pm - 2pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$0.00</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-success">Free</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault34"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault34"
                          >
                            <span>2pm - 3pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>

                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault35"
                          />

                          <label
                            className="form-check-label"
                            for="flexRadioDefault35"
                          >
                            <span>3pm - 4pm</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-3 text-center">$3.99</div>
                      <div className="col-3 text-center">
                        <span className="badge bg-danger">Paid</span>
                      </div>

                      <div className="col-2 text-end">
                        <a
                          href="#"
                          className="btn btn-outline-gray-400 btn-sm text-muted"
                        >
                          Choose
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
             
    </>
  )
}
