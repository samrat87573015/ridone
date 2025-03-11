import React from 'react'
import Lists from '../components/wishlist/list';
import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Wishlist() {
  return (
  
      <>
      
      <Header />
         <div className="mt-4">
            <div className="container">

               <div className="row">
    
                  <div className="col-12">

                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                           <li className="breadcrumb-item"><a href="#!">Home</a></li>
                           <li className="breadcrumb-item"><a href="#!">Shop</a></li>
                           <li className="breadcrumb-item active" aria-current="page">My Wishlist</li>
                        </ol>
                     </nav>
                  </div>
               </div>
            </div>
         </div>

         <Lists />
        
         <Footer />

      </>
    
  )
}
