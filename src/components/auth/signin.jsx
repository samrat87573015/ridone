import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DynamicForm from "../DynamicForm";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../api/authService';

export default function Signin() {
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');  // Redirect to dashboard after login
    }
  }, [isAuthenticated, navigate]);

  // Clean up error state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const signInFields = {
    email: {
      type: "email",
      label: "Email address",
      placeholder: "Email",
      required: true,
      hideLabel: true,
      validate: (value) => {
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
        return null;
      }
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
      required: true,
      hideLabel: true,
      validate: (value) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return null;
      }
    },
  };

  const handleLogin = async (signInFields) => {
    try {
      setLoading(true);
      const result = await dispatch(loginUser(signInFields)).unwrap();
      
      if(result.message) {
        showToast("Login successful", "success");
      }
      
    } catch (error) {
      showToast(
        error.message || "Login failed. Please check your credentials.", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-lg-14 my-8">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-12 offset-lg-1 col-lg-4 order-lg-2 order-1">
            <div className="mb-lg-9 mb-5 text-center">
              <h1 className="mb-1 h2 fw-bold">Sign in to FreshCart</h1>
              <p>Welcome back to FreshCart! Enter your email to get started.</p>
            </div>

            {/* Show error message if exists */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <DynamicForm
              fields={signInFields}
              onSubmit={handleLogin}
              submitButtonText={loading ? "Signing In..." : "Sign In"}
              submitButtonClass="w-100"
              showTerms={false}
              disabled={loading}
            />

            {/* Add forgot password link */}
            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </div>

            {/* Add sign up link */}
            <div className="mt-4 text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <Link to="/signup" className="text-decoration-none">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
