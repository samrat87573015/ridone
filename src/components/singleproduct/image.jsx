import React from 'react'
import { useState } from 'react'
export default function Image() {

    const [activeIndex, setActiveIndex] = useState(0);

    const ActiveproductImages = [
      "assets/images/products/product-single-img-1.jpg",
      "assets/images/products/product-single-img-2.jpg",
      "assets/images/products/product-single-img-3.jpg",
      "assets/images/products/product-single-img-4.jpg",
    ];
  return (
    <>
    <div className="col-lg-6">
                  {/* Main Product Image Display */}
                  <div className="product productModal" id="productModal">
                    <div
                      className="zoom"
                      style={{
                        backgroundImage: `url(${ActiveproductImages[activeIndex]})`,
                      }}
                    >
                      <img src={ActiveproductImages[activeIndex]} alt="" />
                    </div>
                  </div>

                  {/* Thumbnail Section */}
                  <div className="product-tools">
                    <div
                      className="thumbnails row g-3"
                      id="productModalThumbnails"
                    >
                      {ActiveproductImages.map((image, index) => (
                        <div
                          key={index}
                          className={`col-3 ${
                            index === activeIndex ? "tns-nav-active" : ""
                          }`}
                          onClick={() => setActiveIndex(index)} // Set active image on click
                        >
                          <div className="thumbnails-img">
                            <img src={image} alt={`Thumbnail ${index + 1}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
    </>
  )
}
