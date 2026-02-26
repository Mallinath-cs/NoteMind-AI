import React, { useState } from 'react'
import './Signup.css'
import Navbar from '../../components/Navbar/Navbar'
import {Link, useNavigate} from 'react-router-dom'
import {validateEmail} from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance'
import Password from '../../components/Input/Password/Password'

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  if(!fullName.trim()){
    setError("Please enter your Full name");
    return;
  }
  if(!validateEmail(email)){
    setError("Please enter a valid Email address");
    return;
  }
  if(!password){
    setError("Please enter a valid password");
    return;
  }
  setError("");
  setIsLoading(true);
  try{
    const response = await axiosInstance.post("/create-account", {
      fullName: fullName,
      email: email,
      password: password,
      profileImageUrl: "", // optional field
    })
    if(response.data && response.data.accessToken){
      localStorage.setItem("token", response.data.accessToken);
      navigate("/home");
    }
  }catch(error){
    if(error.response?.data?.message){
      setError(error.response.data.message);
    }
    else{
      setError("Something went wrong. Please try again.");
    }
  }
  finally{
    setIsLoading(false);
  }
}
  return (
    <div className="signup">
      <div className="signup-container">
        <h1>Sign Up</h1>
        <p>Create your account to get started</p>
        <form onSubmit={handleSignUp} className='form-container'>
          <input type="text" placeholder='Full Name' value={fullName} onChange={(e) => setFullName(e.target.value)} aria-label='Full Name'/>
          <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} aria-label='Email'/>
            <Password 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          <div className="error-container">
            {error && (
                <span className='error-text'>{error}</span>    
            )}
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='signup-btn'
          >
            {isLoading ? (
              <span className='isloading'>
                <svg className='animate'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                >
                  <circle
                    className='opa'
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                  className='opa1'
                  fill='currentColor'
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  >
                  </path>
                </svg>
                Creating account...
              </span>
            ): ("Sign Up")}
          </button>
          <div className="form-extras">
            <span>Already have an account?</span>
            <Link
              to='/login'
              className='extra-1'
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup