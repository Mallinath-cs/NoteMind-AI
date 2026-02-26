import React from 'react'
import './EmptyCard.css'
import Noteanimation from '../../Noteanimation'
const EmptyCard = ({ message }) => {
  return (
      <div className="empty-state">
        <Noteanimation />
      <p className="empty-text">
        <span className="empty-message">
          {message}
        </span>
      </p>
    </div>
  )
}

export default EmptyCard
