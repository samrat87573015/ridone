import React from 'react'
import Banner from "./image/banner.png"

function Content({section_title,product_description,productImage}) {
  return (
    <>

<div className='content-section container'>

<div className='row d-flex align-items-center justify-content-center'>

  <div className='text-area col-md-6' style={{ fontSize: "19px" }}>
  <div dangerouslySetInnerHTML={{ __html: product_description }} />
{/* {product_description?product_description:`


  <div className='d-flex justify-content-start align-items-center' style={{ gap: "10px" }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#07af00" class="bi bi-check-lg" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      </span>
      <span>আমরাই দিচ্ছি এই সিজনের ফ্রেশ গাছপাকা সিডলেস খেজুর

      </span>
    </div>

    <div className='d-flex mt-2 justify-content-start align-items-center' style={{ gap: "10px" }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#07af00" class="bi bi-check-lg" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      </span>
      <span>আমাদের খেজুর এ কোনো পোকা পাবেন না ইনশাআল্লাহ


      </span>
    </div>

    <div className='d-flex mt-2 justify-content-start align-items-center' style={{ gap: "10px" }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#07af00" class="bi bi-check-lg" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      </span>
      <span>সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি পাবেন
      </span>
    </div>

    <div className='d-flex mt-2 justify-content-start align-items-center' style={{ gap: "10px" }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#07af00" class="bi bi-check-lg" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      </span>
      <span>পণ্য হাতে পাওয়ার পর প্রয়োজনে খেয়ে রিসিভ করতে পারবেন

      </span>
    </div>

    <div className='d-flex mt-2 justify-content-start align-items-center' style={{ gap: "10px" }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#07af00" class="bi bi-check-lg" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      </span>
      <span>আমাদের কথা মত প্রোডাক্ট না পেলে সাথে সাথে রিটার্ন  সুবিধা থাকছে


      </span>
    </div>

    <div className='d-flex mt-2 justify-content-start align-items-center' style={{ gap: "10px" }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#07af00" class="bi bi-check-lg" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
        </svg>
      </span>
      <span>অর্ডার করতে আপনাকে অগ্রিম ১ টাকাও পেমেন্ট করতে হবে না


      </span>
    </div>

`} */}
  


  </div>

  <div className='image-area col-md-6'>
{productImage?<img src={productImage} className='img-fluid' />:<img src={Banner} className='img-fluid' />}
    

  </div>


</div>




</div>
    
    </>
  )
}

export default Content