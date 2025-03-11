import { Navigate, useLocation } from 'react-router-dom'; // Remove useNavigate
import { useSelector } from 'react-redux';

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  // Wait for authentication to be checked
  // if (!initialized) {
  //   return null; // Or a loading spinner
  // }

  if (isAuthenticated) {
    return (
      <Navigate 
        to={location.state?.from?.pathname || "/account-settings"} 
        replace 
      />
    );
  }

  return children;
};