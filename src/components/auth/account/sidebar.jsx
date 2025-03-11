import React, { useEffect, useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { logoutUser, resetAuth } from '../../../api/authService';
import { useDispatch } from "react-redux";
import { useLoading } from "../../LoadingContext";
import { useToast } from "../../ToastContext";

const Sidebar = () => {
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Update active link when URL changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const navItems = [
    {
      path: "/account-orders",
      icon: "feather-icon icon-shopping-bag",
      label: "Your Orders",
    },
    // {
    //   path: "/account-settings",
    //   icon: "feather-icon icon-settings",
    //   label: "Settings",
    // },
    {
      path: "/account-address",
      icon: "feather-icon icon-map-pin",
      label: "Address",
    },
    // {
    //   path: "/account-payment-method",
    //   icon: "feather-icon icon-credit-card",
    //   label: "Payment Method",
    // },
    // {
    //   path: "/account-notification",
    //   icon: "feather-icon icon-bell",
    //   label: "Notification",
    // },
  ];



  const Logout = async () => {
    try {
      setLoading(true);
      
      // Dispatching the logout action and waiting for its success
      //await dispatch(resetAuth()).unwrap();
      await dispatch(logoutUser()).unwrap();
      
      // Show success toast message
      showToast("Logout successful", "success");
      
      // Redirect to the sign-in page after successful logout
      navigate('/signin'); 
    } catch (error) {
      // Show error message in case of failure
      showToast(
        error.message || "Logout failed. Please check your credentials.",
        "error"
      );
    } finally {
      // Reset loading state after the operation completes
      setLoading(false);
    }
  };
  


  return (
    <ul className="nav flex-column nav-pills nav-pills-dark">
      {navItems.map((item) => (
        <li key={item.path} className="nav-item">
          <Link
            to={item.path}
            className={`nav-link ${activeLink === item.path ? "active" : ""}`}
            onClick={() => setActiveLink(item.path)}
          >
            <i className={`${item.icon} me-2`}></i>
            {item.label}
          </Link>
        </li>
      ))}

      <li className="nav-item">
        <hr />
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="#" onClick={Logout}>
          <i className="feather-icon icon-log-out me-2"></i>
          Log out
        </Link>
      </li>
    </ul>
  );
};

export default Sidebar;
