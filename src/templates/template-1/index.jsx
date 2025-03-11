import React from 'react'

import Banner from "../../component/image/banner.png"
import Campaign from '../../component/Campaign'
import Content from '../../component/Content'
import Cart from '../../component/Cart'
import PriceSection from '../../component/PriceSection'

function Home({ productData,Setting }) {

 
  return (
    <>
    

      <div className='container' style={{ paddingTop: "20px" }}>
     
        <div className='headline'>
          <h2 className='text-center fw-bold primary-color'>
           {productData?.name ? productData?.name :' বিচি মুক্ত সিডলেস খেজুর' }
          </h2>

        </div>

        <div className='banner d-flex justify-content-center align-items-center mt-3 col-md-6 m-auto'>

      

          {productData?.featured_image ?<img src={productData?.featured_image}/>:<img src={Banner}/> } 

        </div>
  

        <Campaign dateandtime={productData?.countdowndate}  />

        <PriceSection previousPrice={productData?.previous_price} Price={productData?.price} />

        <div className='background-text-section mt-5 mb-5 '>
        <h2 className='text-center fw-bold'> {productData?.name ? productData?.name :'আমাদের কাছে কেনো কিনবেন ?' }</h2>

      </div>
      <Content section_title={productData?.section_title} product_description={productData?.product_description} productImage={productData?.first_image} />

<Cart product={productData} Setting={Setting} />
      </div>

      

      


    </>
  )
}

export default Home