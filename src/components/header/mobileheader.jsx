import { useState, useEffect } from 'react'; // Import useEffect for synchronization
import { Home, Search, User } from 'lucide-react';
import { Link,  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCart } from '../../api/store/slices/cartSlice';
import SearchCard from './search';
import Headercart from './headercart';
export default function MobileHeader() {
  

  const [activeLink, setActiveLink] = useState(window.location.pathname || ''); // Default to home if pageType is undefined
  const [isSearchOpen, setSearchOpen] = useState(false);
  const { activecart, items } = useSelector((state) => state.cart);
  const [cartCount, setCartCount] = useState(items.length || 0);
  const dispatch = useDispatch();
  const [cartList, activecartList] = useState(0);
  // Function to handle link click
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const addCartSection = () => {
    dispatch(setActiveCart(true));
  };

  return (
   <>
    <nav className="mobile-menu d-lg-none">
      {/* Search Icon */}
      <li className={activeLink === 'filter' ? 'active-menu' : ''}>
        <Link to="#" onClick={() => {
          handleLinkClick('filter');
          toggleSearch()
          }} >
          <Search />
          <label>Search</label>
        </Link>
      </li>



      {/* Track Order */}
      <li className={activeLink === '/order/tracking' ? 'active-menu' : ''}>
        <Link to="/order/tracking" onClick={() => handleLinkClick('/order/tracking')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
          </svg>
          <label>Track Order</label>
        </Link>
      </li>

    {/* Cart Icon */}
    <li className={activeLink === 'cart' ? '' : ''}>
       <Link to="#" onClick={() => {
        handleLinkClick('cart');
        addCartSection();
       }}>
    
       <div className='cart-controller'>
       <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-shopping-bag"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
       </div>
       <label>Cart</label>
      
        </Link>
      </li>
      {/* User Icon */}
      <li className={activeLink === '/signin' ? 'active-menu' : ''}>
        <Link to="/signin" onClick={() => handleLinkClick('/signin')}>
          <User />
          <label>Login</label>
        </Link>
      </li>

      {/* Home Link */}
      <li className={activeLink === '/' ? 'active-menu' : ''}>
        <Link to="/" onClick={() => handleLinkClick('/')}>
          <Home />
          <label>Home</label>
        </Link>
      </li>
      {/* Full-page search overlay */}
      {isSearchOpen && (
         <div className="search-overlay">
        <SearchCard/>
        <button className="close-search" onClick={toggleSearch}>
             Close
           </button>
       </div>
      )}
    </nav>
    <div
    
    className={`offcanvas offcanvas-end ${cartList === 1 || activecart ? "show" : ""}`}

    id="offcanvasRight"
    aria-labelledby="offcanvasRightLabel"
  >
  <Headercart/>

  </div>
   </>

  );
}
