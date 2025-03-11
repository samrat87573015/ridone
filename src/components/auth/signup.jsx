import React, { useEffect } from "react";
import DynamicForm from "../DynamicForm";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../api/authService";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../LoadingContext";
import { useToast } from "../ToastContext";
import { Link } from "react-router-dom";
export default function Signup() {
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth state from Redux
  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // or wherever you want to redirect after login
    }
  }, [isAuthenticated, navigate]);

  // Clean up error state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const signUpFields = {
    // firstName: {
    //   type: "text",
    //   label: "First Name",
    //   placeholder: "First Name",
    //   required: true,
    //   hideLabel: true,
    // },
    name: {
      type: "text",
      label: "Full name",
      placeholder: "Full name",
      required: true,
      hideLabel: true,
    },
    email: {
      type: "email",
      label: "Email address",
      placeholder: "Email",
      required: true,
      hideLabel: true,
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
      required: true,
      hideLabel: true,
    },
  };

  const handleReg = async (signUpFields) => {
    try {
      setLoading(true);
      const result = await dispatch(registerUser(signUpFields)).unwrap();
      console.log(result);
      showToast("Login successful", "success");
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
          {/* <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
      
             <img src="../assets/images/svg-graphics/signup-g.svg" alt="" className="img-fluid"/>
          </div> */}

          <div className="col-12 col-md-12 offset-lg-1 col-lg-4 order-lg-2 order-1">
            <div className="mb-lg-9 mb-5 text-center">
              <h1 className="mb-1 h2 fw-bold">Get Start Shopping</h1>
              <p>Welcome to FreshCart! Enter your email to get started.</p>
            </div>

            {/* <form className="needs-validation" novalidate="">
                <div className="row g-3">
       
                   <div className="col">
                
                      <label for="formSignupfname" className="form-label visually-hidden">First Name</label>
                      <input type="text" className="form-control" id="formSignupfname" placeholder="First Name" required=""/>
                      <div className="invalid-feedback">Please enter first name.</div>
                   </div>
                   <div className="col">
                    
                      <label for="formSignuplname" className="form-label visually-hidden">Last Name</label>
                      <input type="text" className="form-control" id="formSignuplname" placeholder="First Name" required=""/>
                      <div className="invalid-feedback">Please enter last name.</div>
                   </div>
                   <div className="col-12">
                    
                      <label for="formSignupEmail" className="form-label visually-hidden">Email address</label>
                      <input type="email" className="form-control" id="formSignupEmail" placeholder="Email" required=""/>
                      <div className="invalid-feedback">Please enter email.</div>
                   </div>
                   <div className="col-12">
                      <div className="password-field position-relative">
                         <label for="formSignupPassword" className="form-label visually-hidden">Password</label>
                         <div className="password-field position-relative">
                            <input type="password" className="form-control fakePassword" id="formSignupPassword" placeholder="*****" required=""/>
                            <span><i className="bi bi-eye-slash passwordToggler"></i></span>
                            <div className="invalid-feedback">Please enter password.</div>
                         </div>
                      </div>
                   </div>
  
                   <div className="col-12 d-grid"><button type="submit" className="btn btn-primary">Register</button></div>

       
                   <p>
                      <small>
                         By continuing, you agree to our
                         <a href="#!">Terms of Service</a>
                         &amp;
                         <a href="#!">Privacy Policy</a>
                      </small>
                   </p>
                </div>
             </form> */}

            <DynamicForm
              fields={signUpFields}
              onSubmit={handleReg}
              submitButtonText="Register"
              showTerms={true}
              termsText="By continuing, you agree to our Terms of Service & Privacy Policy"
            />
              <div className="modal-footer border-0 justify-content-center">
            Already have an account?
            <Link to="/signin">Sign in</Link>
          </div>
          </div>
        
        </div>
      </div>
    </section>
  );
}
