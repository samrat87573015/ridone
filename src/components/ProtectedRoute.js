import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserData } from '../api/store/slices/userSlice';
import { refreshToken } from '../api/authService';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    // dispatch(refreshToken())
    // dispatch(getUserData())
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated])
  
 return isAuthenticated ? children:null

};
