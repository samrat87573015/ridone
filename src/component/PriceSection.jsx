import React from 'react';

import cross from "./image/cross.gif"

const PriceSection = ({previousPrice,Price}) => {
  return (
    <div className='price-section mt-5'>
      <div
        className='d-flex justify-content-center align-items-center mt-3 fw-bold'
        style={{ gap: '35px', fontSize: '25px' }}
      >
        {/* Regular Price with Cross Animation */}

        <div className=''>

          <div className='regular-price'>
            রেগুলার মূল্য <span className="crossed-price">{previousPrice}</span>
            <span className='cross'>

            <img src={cross}

style={{
  filter: 'invert(58%) sepia(95%) saturate(352%) hue-rotate(347deg) brightness(95%) contrast(92%)',
  width: '70px', // Adjust size as needed
  height: '70px', // Adjust size as needed
}} />

            </span>
          </div>

         

        </div>




        {/* Discounted Price with Circle Animation */}
        <div className='primary-color discount-price'>
          বর্তমান ডিসকাউন্ট মূল্য <span className="circled-price">{Price}</span> টাকা
        </div>
      </div>

      {/* Order Button */}
      <div className='button-group mt-3 d-flex justify-content-center align-items-center'>
        <button className='btn btn-danger btn-lg d-flex align-items-center justify-content-center'>
          <span className='me-2 d-flex align-items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-cart"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
          </span>
          অর্ডার করতে চাই
        </button>
      </div>
    </div>
  );
};

export default PriceSection;
