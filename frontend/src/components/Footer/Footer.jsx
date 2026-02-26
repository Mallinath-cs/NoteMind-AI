import React from 'react'
import './Footer.css'
import discord from '../../assets/discord.png'
import instagram from '../../assets/instagram.png'
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
const Footer = () => {
  return (
    <div>
      <div className='footer' >
      <div className="main-footer">
        <div className="socials">
            <ul>
                <li><a className='link' href="https://discordapp.com/users/tyson6996" target='_blank' rel="noopener noreferrer" alt="Discord link" aria-label="discord"><img src={discord} alt="" /></a></li>
                <li><a className='link' href="https://x.com/MALLINATH137904" target='_blank' rel="noopener noreferrer" alt="x link" aria-label="X link"><img src={twitter} alt="" /></a></li>
                <li><a className='link' href="https://www.instagram.com/mallinath_cs/" target='_blank' rel="noopener noreferrer" alt="Instagram link" aria-label="Instagram"><img src={instagram} alt="" /></a></li>
                <li><a className='link' href="https://www.facebook.com/profile.php?id=100009845582808" target='_blank' rel="noopener noreferrer" alt="Facebook link" aria-label="Facebook"><img src={facebook} alt="" /></a></li>
            </ul>
        </div>
        <div className="my-copyright">
            &copy; {new Date().getFullYear()} NoteMind AI. All Rights Reserved.
        </div>
      </div>
    </div>
    </div>
  )
}

export default Footer
