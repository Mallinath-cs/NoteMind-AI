import React, { useState, useRef, useEffect } from 'react'
import './Profile.css'
import { getInitials } from '../../../utils/helper'
import { IoChevronDown } from 'react-icons/io5'

const Profile = ({ userInfo, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="profile-wrapper" ref={dropdownRef}>
      
      {/* Top clickable area */}
      <div 
        className="profile-header"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="profile-greeting">
          Hi {userInfo?.fullName}!
        </span>

        <div className="profile-icon">
          {getInitials(userInfo?.fullName)}
        </div>

        <IoChevronDown className={`dropdown-arrow ${isOpen ? "rotate" : ""}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-item">
            Hi {userInfo?.fullName}
          </div>
          <div 
            className="dropdown-item logout"
            onClick={onLogout}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile