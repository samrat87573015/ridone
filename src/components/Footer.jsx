import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchHomeData } from '../api/homeservice'

export default function Footer() {
  const dispatch = useDispatch();
  const siteInfo = useSelector(state => state.home.siteinfos[0]) // Assuming siteInfo is in Redux store
  const media = useSelector(state => state.home.siteinfos?.media || []);
  const pages = useSelector(state => state.home.siteinfos.pages || []);
  
  useEffect(() => {
    // siteinfo check if not then dispatch fetchHomeData
    if (!siteInfo) {
      dispatch(fetchHomeData());
    }    
  }, [dispatch, siteInfo])

  return (
    <>

      <footer className="footer_area text-white py-5">
        <div className="container">
          <div className="row mb-4">
            {/* Logo Section - Left */}
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="mb-4">
                <img src={media[0]?.footer_image || media[0]?.logo } alt="logo" className="img-fluid" style={{maxWidth: '150px'}} />
              </div>
              <div className="mb-2">
                <img src={'assets/images/barvida-logo.png'} alt="BARVIDA logo" className="img-fluid" style={{maxWidth: '120px'}} />
              </div>
              <p className="small">
                Bangladesh Reconditioned Vehicles<br /> Importers and Dealers Association
              </p>
              <p className="small">MEMBER ID: 2232 2305</p>
            </div>

            {/* Quick Links - Middle */}
            <div className="col-md-3 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3 footer_title">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                <li className="mb-2"><Link to="/products" className="text-white text-decoration-none">Product</Link></li>
                <li className="mb-2"><Link to="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link></li>
                <li className="mb-2"><Link to="/terms-condition" className="text-white text-decoration-none">Terms & Condition</Link></li>
              </ul>
            </div>

            {/* Explore Section - Middle */}
            <div className="col-md-3 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3 footer_title">Explore {siteInfo?.app_name || 'Ride On'}</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/buy-new-car" className="text-white text-decoration-none">Buy New Car</Link></li>
                <li className="mb-2"><Link to="/auction-sheet-verification" className="text-white text-decoration-none">Auction Sheet Verification</Link></li>
                <li className="mb-2"><Link to="/blog" className="text-white text-decoration-none">Blog</Link></li>
                {pages?.slice(0, 3).map((page) => (
                  <li key={page.id} className="mb-2">
                    <Link 
                      className="text-white text-decoration-none" 
                      to={`/${page.type}`}
                    >
                      {page.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section - Right */}
            <div className="col-md-3">
              <h5 className="fw-bold mb-3 footer_title">Contact</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href={`https://wa.me/${siteInfo?.whatsapp_number}`} className="text-white text-decoration-none d-flex align-items-center">
                    <i className="bi bi-whatsapp me-2"></i> {siteInfo?.store_phone_number}
                  </a>
                </li>
                <li className="mb-2">
                  <a href={`tel:${siteInfo?.store_phone_number}`} className="text-white text-decoration-none d-flex align-items-center">
                    <i className="bi bi-telephone me-2"></i> {siteInfo?.store_phone_number}
                  </a>
                </li>
                <li className="mb-2">
                  <a href={`mailto:${siteInfo?.store_email}`} className="text-white text-decoration-none d-flex align-items-center">
                    <i className="bi bi-envelope me-2"></i> {siteInfo?.store_email}
                  </a>
                </li>
              </ul>

              <h5 className="fw-bold mb-3 mt-4 footer_title">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href={siteInfo?.facebook_url} className="text-white" aria-label="Facebook">
                  <i className="bi bi-facebook fs-5"></i>
                </a>
                {/* <a href={siteInfo?.linkedin_url || '#'} className="text-white" aria-label="LinkedIn">
                  <i className="bi bi-linkedin fs-5"></i>
                </a> */}
                <a href={siteInfo?.tiktok_url || '#'} className="text-white" aria-label="TikTok">
                  <i className="bi bi-tiktok fs-5"></i>
                </a>
                <a href={siteInfo?.instagram_url} className="text-white" aria-label="Instagram">
                  <i className="bi bi-instagram fs-5"></i>
                </a>
                <a href={siteInfo?.youtube_url} className="text-white" aria-label="YouTube">
                  <i className="bi bi-youtube fs-5"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-top border-secondary pt-3 text-center">
            <p className="small mb-0">© {new Date().getFullYear()} {siteInfo?.app_name || 'Ride On'}. All Rights reserved. Developed By <a className="text-white" href="https://softexel.com/" target="_blank" rel="noopener noreferrer">Softexel</a></p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a href={`https://wa.me/${siteInfo?.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="position-fixed bottom-0 end-0 mb-4 me-4 bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', zIndex: 1000}}>
        <i className="bi bi-whatsapp fs-4"></i>
      </a>

      {/* Scroll to Top Button */}
      <a href="#" className="position-fixed bottom-0 start-0 mb-4 ms-4 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', zIndex: 1000}} aria-label="scroll to top">
        <i className="bi bi-chevron-up"></i>
      </a>
    </>
  )
}
