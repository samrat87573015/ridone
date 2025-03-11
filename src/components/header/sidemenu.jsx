import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Sidemenu() {
    const categories = useSelector((state) => state.home.categories);
  return (
    <>

    <div className="col-md-3 sidemenu d-none d-xl-block">
                  
                  <div className="dropdown me-3d-lg-block">
                    <button
                      className="btn btn-primary px-6 d-flex"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="me-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-grid"
                        >
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </span>
                      <span className='ctg-text'>All Categorys</span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {categories.map((ctg) => (
                        <li>
                          <Link
                            className="dropdown-item"
                            to={"/filter/?category=" + ctg?.slug}
                          >
                            {" "}
                            {ctg?.name}{" "}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
        
    </>
  )
}
