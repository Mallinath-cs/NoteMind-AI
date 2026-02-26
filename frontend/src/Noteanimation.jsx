import React from 'react'
import Lottie from "lottie-react";
import note_animation from './assets/Taking_notes.json'
const Noteanimation = () => {
  return (
    <div style={{ width: 300 }}>
      <Lottie 
        animationData={note_animation} 
        loop={true} 
        autoplay={true} 
      />
    </div>
  )
}

export default Noteanimation
