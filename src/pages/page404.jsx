import React from 'react'
import { Link } from 'react-router-dom'

export default function page404() {
  return (
    <section>
    <div className="container d-flex flex-column">

       <div className="row min-vh-100 justify-content-center align-items-center">
   
          <div className="offset-lg-1 col-lg-10 py-8 py-xl-0">
             <div className="mb-10 mb-xxl-0">
    
                <a href="../"><img src="../assets/images/logo/1727679220.webp" alt=""/></a>
             </div>
             <div className="row justify-content-center align-items-center">
         
                <div className="col-md-6">
                   <div className="mb-6 mb-lg-0">
                      <h1>Something’s wrong here...</h1>
                      <p className="mb-8">
                         We can’t find the page you’re looking for.
                         <br/>
                         Check out our help center or head back to home.
                      </p>
                  
                      <Link to="/" className="btn btn-dark">
                         Help Center
                         <i className="feather-icon icon-arrow-right"></i>
                      </Link>
                  
                      <Link to="/" className="btn btn-primary ms-2">Back to home</Link>
                   </div>
                </div>
                <div className="col-md-6">
                   <div>
                      
                      <img src="../assets/images/svg-graphics/error.svg" alt="" className="img-fluid"/>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
 </section>
  )
}
