import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import './Password.css'
const Password = ({ value, onChange, placeholder = "Password" }) => {

  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };
  return (
    <div className='password-container'>
      <input 
      type={isShowPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className='input-password'
      />
      <button
      type='button'
      onClick={toggleShowPassword}
      className='password-buttons'
      aria-label={isShowPassword ? "Hide password" : "Show password"}
      >
        {isShowPassword ? (
          <FaRegEye 
            className='show-password'
            size={20}

          />
        ): (
          <FaRegEyeSlash 
            className='hide-password'
            size={20}
          />
        )}
      </button>
    </div>
  )
}

export default Password
