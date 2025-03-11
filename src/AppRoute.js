import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { LoadingProvider } from './components/LoadingContext'; 
import GlobalLoader from './components/GlobalLoader'; 
import Home from './pages/home';
import Page404 from './pages/page404';
import SignupPage from './pages/signuppage';
import SigninPage from './pages/signinpage';
import Wishlist from './pages/wishlist';
import Productpage from './pages/product';
import Cart from './pages/cart';
import ForgetPassword from './pages/forgetpassword';
import Checkout from './pages/checkout';
import CheckoutSucess from './pages/checkoutsuccess';
import Filter from './pages/filter';
import Account from './pages/account';
import TrackOrder from './pages/track';
import AccountSetting from './pages/accountsetting';
import AccountAddress from './pages/accountaddress';
import AccountPayment from './pages/accountpayment';
import AccountNotification from './pages/accountnotification';
import About from './pages/about';
import Blog from './pages/blog';
import BlogDetails from './pages/blogdetails';
import Contact from './pages/contact';
import { ToastProvider } from './components/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import DynamicPage from './pages/dynamicpage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData } from './api/homeservice';
import { useLoading } from './components/LoadingContext';
import ApiCall from './pages/apicall'
import TemplateHome from './templates/home/Home'
import Homeofapi from './templates/home/Home';
import axiosInstance from './api/axiosInstance';
import Loader from './component/loader';
import Template1 from './templates/template-1/index'
import Template2 from './templates/template-2/index'
import Template3 from './templates/template-3/index'
import Car from './pages/car';
function AppRoute() {


  const siteinfos = useSelector((state) => state.home?.siteinfos[0]);
  const media = useSelector((state) => state.home?.siteinfos?.media || []);
  const marketing = useSelector((state) => state.home?.siteinfos?.marketing || []);
  const favicon = media[0]?.favicon;

  useEffect(() => {
    // Set the page title
    document.title = siteinfos?.app_name || '';

    // Check if a favicon exists
    if (favicon) {
      // Remove any existing favicon link
      const existingFavicon = document.querySelector("link[rel='icon']");
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // Create a new link tag for favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = favicon;
      document.head.appendChild(link);
    }
      // Add marketing scripts
  marketing.forEach((item) => {
    if (item?.script) {
      // Check if script already exists
      if (!document.querySelector(`script[data-marketing="${item.identifier}"]`)) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.script.trim(); // Parse the script safely

        const scriptElement = tempDiv.querySelector('script');
        if (scriptElement) {
          scriptElement.setAttribute('data-marketing', item.identifier); // Add identifier
          document.head.appendChild(scriptElement);
        } else {
          console.error(`Invalid script format in marketing item: ${item.identifier}`);
        }
      }
    }
  });
  }, [favicon, siteinfos,marketing]); // Re-run effect when favicon or siteinfos change


  function TemplateWithData() {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);
    const [Setting, setSetting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProductData = async () => {
        try {
          const response = await axiosInstance.get(`/template-product/${productId}`);
          const setting = await axiosInstance.get(`/products/setting`);
          setProductData(response.data);
          setSetting(setting.data);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch product data ' + error);
          setLoading(false);
          console.error('Error fetching product data:', error);
        }
      };
  
      fetchProductData();
    }, [productId]); // Re-fetch when productId changes
  
    if (loading) {
      return <Loader />;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    // Convert template_id to a number to ensure proper comparison
    const templateId = Number(productData.template_id);
  
    // Render different templates based on templateId
    switch (templateId) {
      case 1:
        return <Template1 productData={productData} Setting={Setting} />;
      case 2:
        return <Template2 productData={productData} Setting={Setting} />;
      case 3:
        return <Template3 productData={productData} Setting={Setting} />;
      // Add more templates as needed
      default:
        return <div>Template not found</div>;
    }
  }
  


  return (
    <LoadingProvider>
      <ToastProvider>
        <GlobalLoader />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:slug" element={<Productpage />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />


            <Route path="/template" element={<TemplateHome />} />
            <Route path="/api" element={<ApiCall />} />


            
            {/* Guest Routes (Only accessible when not logged in) */}
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <GuestRoute>
                  <SigninPage />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgetPassword />
                </GuestRoute>
              }
            />
            
            {/* Protected Routes (Only accessible when logged in) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
              
                  <Checkout />
             
              }
            />
            <Route
              path="/checkout/success/:invoice"
              element={
              
                  <CheckoutSucess />
             
              }
            />
            <Route
              path="/:pageType"
              element={
              
                  <DynamicPage />
             
              }
            />
            <Route
              path="/order/tracking"
              element={
              
                  <TrackOrder />
             
              }
            />
            <Route
              path="/shop-wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-orders"
              element={
                <ProtectedRoute>
                  <Account />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/account-settings"
              element={
                <ProtectedRoute>
                  <AccountSetting />
                  </ProtectedRoute>
               
              }
            />
            <Route
              path="/account-address"
              element={
               
                <ProtectedRoute>
                  <AccountAddress />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/account-payment-method"
              element={
                <ProtectedRoute>
                  <AccountPayment />
                  </ProtectedRoute>
              }/>
            <Route
              path="/account-notification"
              element={
                <ProtectedRoute>
                  <AccountNotification />
                  </ProtectedRoute>
              }
            />
            
            {/* Dashboard redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AccountSetting />
                  </ProtectedRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<Page404 />} />


            {/* TemplateWithData */}
            <Route path="/car" element={<Car />} />
            <Route path="/landingpage" element={<Homeofapi />} />
            <Route path="/landingpage/:productId" element={<TemplateWithData />} />

          </Routes>
        </Router>
      </ToastProvider>
    </LoadingProvider>
  );
}

export default AppRoute;