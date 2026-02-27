import React, { useState } from 'react'
import Profile from '../Cards/Profile/Profile'
import { useNavigate, useLocation } from 'react-router-dom'
import { MdAdd } from "react-icons/md";
import { motion } from "framer-motion";
import Searchbar from '../SearchBar/SearchBar'
import './Navbar.css'
const Navbar = ({ userInfo, onSearchNote, handleClearSearch, onAddNote }) => {
  const [ searchQuery, setSearchQuery ] = useState("");
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const onLogout = () => {
    localStorage.clear();
    navigate("/Login");
  }
  const handleSearch = () => {
    if (searchQuery) onSearchNote(searchQuery);
  }
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }
  const hideOn = ["/Login", "/signUp"];
  if (hideOn.includes(location.pathname)){
    return null; // Dont render navbar
  }
  const toggleMenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsMenuOpen(!isMenuOpen);
};
  return (
    <div className='navbar'>
      <div className="navbar-01">
        <div className="navbar-02">
          <h2 className='navbar-left'>
            <span className='navbar-03'>
              NoteMind
            </span>
            <span className='navbar-04'>AI</span>
          </h2>
        </div>
        <div className="navbar-search">
          <Searchbar 
            value={searchQuery}
            onChange = { ({target}) => setSearchQuery(target.value)}
            handleSearch= {handleSearch}
            onClearSearch = {onClearSearch}
          />
        </div>
        <div className="navbar-right">
          <motion.button
            className="gradient-button"
            onClick={onAddNote}
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            <MdAdd />
          </motion.button>

          <Profile 
            userInfo={userInfo} 
            onLogout={onLogout}
          />
        </div>
      </div>
      {/* Mobile view */}
      <div className="mobile-header">
      <div className="header-row">
        <h2 className="header-title">
          <span className="brand-primary">NoteMind</span>
          <span className="brand-secondary">AI</span>
        </h2>
        <div className="mobile-navbar-right">
        <motion.button
          className="mobile-add-button"
          onClick={onAddNote}
          whileTap={{ scale: 0.85 }}
        >
          <MdAdd />
        </motion.button>
        <button 
          type="button"
          className="menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            className="menu-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d = "M6 18L18 6M6 6l12 12"
              ></path>
            ):(
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d="M4 6h16M4 12h16M4 18h16"
              >
              </path>
            )}
            </svg>
            </button>
          </div>
    </div>
    {isMenuOpen && (
      <div className="navbar-mobile-search">
        <Searchbar 
            value={searchQuery}
            onChange = { ({target}) => setSearchQuery(target.value)}
            handleSearch= {handleSearch}
            onClearSearch = {onClearSearch}
        />
        <div className="mobile-profile-view">
          <Profile userInfo={userInfo} onLogout={onLogout}/>
        </div>
      </div>
    )}
    </div>
    </div>
  )
}

export default React.memo(Navbar);
