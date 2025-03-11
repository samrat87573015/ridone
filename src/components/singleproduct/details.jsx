import React from 'react'

export default function details() {
  return (
    <div className="col-md-7 col-xl-6">
    <div className="ps-lg-10 mt-6 mt-md-0">
       <div className='col-md-12 row'>
          <div className='col-md-9'>
          <a href="#!" className="mb-4 d-block">Bakery Biscuits</a>
       
          </div>
          <div className='col-md-3'>
          
       
       <a className="btn btn-light" href="#" data-bs-toggle="tooltip" data-bs-html="true" aria-label="Compare"><i className="bi bi-arrow-left-right"></i></a>
       <a className="btn btn-light mx-2" href="shop-wishlist.html" data-bs-toggle="tooltip" data-bs-html="true" aria-label="Wishlist"><i className="feather-icon icon-heart"></i></a>

          </div>
       </div>
       
       
       <h1 className="mb-1">Napolitanke Ljesnjak</h1>
       <div className="mb-4">
  
  
          <small className="text-warning">
             <i className="bi bi-star-fill"></i>
             <i className="bi bi-star-fill"></i>
             <i className="bi bi-star-fill"></i>
             <i className="bi bi-star-fill"></i>
             <i className="bi bi-star-half"></i>
          </small>
          <a href="#" className="ms-2">(30 reviews)</a>
       </div>
       <div className="fs-4">
  
          <span className="fw-bold text-dark">$32</span>
          <span className="text-decoration-line-through text-muted">$35</span>
          <span><small className="fs-6 ms-2 text-danger">26% Off</small></span>
       </div>

       <hr className="my-6"/>
       <div>
         
          <table className="table table-borderless mb-0">
             <tbody>
                <tr>
                   <td>Product Code:</td>
                   <td>FBB00255</td>
                </tr>
                <tr>
                   <td>Availability:</td>
                   <td>In Stock</td>
                </tr>
              
                <tr>
                   <td>Type:</td>
                   <td>Fruits</td>
                </tr>
                <tr>
                   <td>Shipping:</td>
                   <td>
                      <small>
                         01 day shipping.
                         <span className="text-muted">( Free pickup today)</span>
                      </small>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
       
       <hr className="my-6"/>
       <div className="mb-5">
          <button type="button" className="btn btn-outline-secondary">250g</button>
    
          <button type="button" className="btn btn-outline-secondary mx-2">500g</button>
    
          <button type="button" className="btn btn-outline-secondary">1kg</button>
       </div>
       <div>
   
          <div className="input-group input-spinner">
             <input type="button" value="-" className="button-minus btn btn-sm" data-field="quantity"/>
             <input type="number" step="1" max="10" value="1" name="quantity" className="quantity-field form-control-sm form-input"/>
             <input type="button" value="+" className="button-plus btn btn-sm" data-field="quantity"/>
          </div>
       </div>
       <div className='col-md-12 row mt-5'>
          <div className='col-xxl-6 col-lg-6 col-md-6 col-6 d-grid'>
             <button type="button w-100" className="btn btn-primary" style={{background:'#CD6727',borderColor:'#CD6727'}}>
                   <i className="feather-icon icon-shopping-bag me-2"></i>
                   Add to cart
                </button>
          </div>
          <div className='col-xxl-6 col-lg-6 col-md-6 col-6 d-grid'>
             <button type="button" className="btn btn-primary" style={{background:'black',borderColor:'black'}}>
                   <i className="feather-icon icon-shopping-bag me-2"></i>
                   Order Now
                </button>
          </div>
       </div>
       <div className='col-md-12 row mt-5'>
          <div className='col-xxl-12 col-lg-12 col-md-12 col-12 d-grid'>
             <button type="button w-100" className="btn btn-primary">
                   <i className="feather-icon icon-shopping-bag me-2"></i>
                   Call Now
                </button>
          </div>
          <div className='col-xxl-12 col-lg-12 col-md-12 col-12 d-grid mt-5'>
             <button type="button" className="btn btn-primary">
                   <i className="feather-icon icon-shopping-bag me-2"></i>
                   WhatsApp
                </button>
          </div>
       </div>

    
       <hr className="my-6"/>
       
    
    </div>
 </div>
  )
}
