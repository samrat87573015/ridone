import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from './api/store/slices/userSlice';

const InitializeAuth = ({ children }) => {
  const dispatch = useDispatch();
  const { initialized, isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!initialized && isAuthenticated && !user) {
      dispatch(getUserData());
    }
  }, [dispatch, initialized, isAuthenticated, user]);

  return children;
};

export default InitializeAuth;
