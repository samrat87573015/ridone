import React from 'react'

export default function Main() {
  return (
    <main>
        

         <section className="my-lg-14 my-8">
            
            <div className="container">
               <div className="row">
                 
                  <div className="offset-lg-2 col-lg-8 col-12">
                     <div className="mb-8">
                       
                        <h1 className="h3">Retailer Inquiries</h1>
                        <p className="lead mb-0">This form is for retailer inquiries only. For all other customer or shopper support requests, please visit the links below this form.</p>
                     </div>
                 
                     <form className="row needs-validation" novalidate="">
                        
                        <div className="col-md-6 mb-3">
                           <label className="form-label" for="contactFName">
                              First Name
                              <span className="text-danger">*</span>
                           </label>
                           <input type="text" id="contactFName" className="form-control" name="contactFName" placeholder="Enter Your First Name" required=""/>
                           <div className="invalid-feedback">Please enter firstname.</div>
                        </div>
                        <div className="col-md-6 mb-3">
                           
                           <label className="form-label" for="contactLName">
                              Last Name
                              <span className="text-danger">*</span>
                           </label>
                           <input type="text" id="contactLName" className="form-control" name="contactLName" placeholder="Enter Your Last name" required=""/>
                           <div className="invalid-feedback">Please enter lastname.</div>
                        </div>
                        <div className="col-md-12 mb-3">
                           
                           <label className="form-label" for="contactCompanyName">
                              Company
                              <span className="text-danger">*</span>
                           </label>
                           <input type="text" id="contactCompanyName" name="contactCompanyName" className="form-control" placeholder="Your Company" required=""/>
                           <div className="invalid-feedback">Please enter company.</div>
                        </div>
                        <div className="col-md-12 mb-3">
                           
                           <label className="form-label" for="contactTitle">Title</label>
                           <input type="text" id="contactTitle" name="contactTitle" className="form-control" placeholder="Your Title" required=""/>
                           <div className="invalid-feedback">Please enter title.</div>
                        </div>
                        <div className="col-md-6 mb-3">
                           <label className="form-label" for="contactEmail">
                              Email
                              <span className="text-danger">*</span>
                           </label>
                           <input type="email" id="contactEmail" name="contactEmail" className="form-control" placeholder="Enter Your First Name" required=""/>
                           <div className="invalid-feedback">Please enter email.</div>
                        </div>
                        <div className="col-md-6 mb-3">
                           
                           <label className="form-label" for="contactPhone">Phone</label>
                           <input type="text" id="contactPhone" name="contactPhone" className="form-control" placeholder="Your Phone Number" required=""/>
                           <div className="invalid-feedback">Please enter phone.</div>
                        </div>
                        <div className="col-md-12 mb-3">
                           
                           <label className="form-label" for="contactTearea">Textarea</label>
                           <textarea rows="3" id="contactTearea" className="form-control" placeholder="Additional Comments" required=""></textarea>
                           <div className="invalid-feedback">Please enter a message in the textarea.</div>
                        </div>
                        <div className="col-md-12">
                       
                           <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </section>
      </main>
  )
}
