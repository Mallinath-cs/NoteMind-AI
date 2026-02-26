import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './NoteCard.css'
import moment from 'moment'
import {
  MdOutlinePushPin,
  MdCreate,
  MdDelete,
  MdCalendarToday,
  MdOpacity
} from 'react-icons/md'

const NoteCard = (
  {title,
  date,
  content,
  tags= [],
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  onDateChange}
) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = {
    background: "#FFFFFF",
    primary: "#BF4646",
    accent: "white",
    highlight: "#BF4646",
    text: "#1E293B"
  }
    const getFormattedDate = (dateValue) => {
    if(!dateValue) return "No Date";

    let momentObj;
    if(moment.isMoment(dateValue)){
      momentObj = dateValue;
    }else if (typeof dateValue === "number" || !isNaN(Number(dateValue))){
      const numValue = Number(dateValue);
      momentObj = 
        numValue.toString().length > 10
        ? moment(numValue)
        : moment.unix(numValue);
    }else{
      momentObj = moment(dateValue, moment.ISO_8601, true).local();
    }
    if(momentObj && momentObj.isValid()){
      momentObj = momentObj.local();
      return momentObj.format("Do MMM YYYY, h:mm A");
    }
    return "No Date";
  }
  const formattedDate = getFormattedDate(date);
  const cardVariants = {
    initial: { y: 20, opacity: 0},
    animate: { y: 0, opacity: 1},
  }
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.15, transition: { type: "spring", stiffness: 400}}
  }
  const truncateContent = (text, maxLength = 100) =>
    text?.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  return (
      <motion.div
        className='notecards-container'
        style={{
          background: colors.background,
          borderLeft: `5px solid ${colors.primary}`,
          color: colors.text,
          cursor: "pointer"
        }}
        variants={cardVariants}
        initial={false}
        animate="animate"
        onClick={() => setIsExpanded(prev => !prev)}   // 👈 expand on card click
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
      <div style={{ padding: '1rem' }}>
    
        <div className="notecard-01">
          <div>
            <h2 className='notecard-h6' style={{ color: colors.primary}}>
              {title}
            </h2>
            <div className="notecard-02">
              <MdCalendarToday className='notecard-03' />
              {formattedDate}
            </div>
          </div>

          <motion.button
            className={`notecard-button ${isPinned ? "pinned" : ""}`}
            onClick={onPinNote}
            variants={buttonVariants}
            whileHover="hover"
          >
            <MdOutlinePushPin className="notecard-04" />
          </motion.button>
        </div>
        <div className="notecard-05">
          <AnimatePresence initial={false}>
            <motion.div
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <p className="notecard-06">
                {isExpanded ? content : truncateContent(content, 80)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="notecard-07">
          <div className="notecard-08">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className='tags-list'
                style={{
                  background: colors.accent,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <motion.div
            className='notecard-09'
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 1 : 0.6}}
          >
            <motion.button
              className='notecard-10'
              onClick={onEdit}
              variants={buttonVariants}
              whileHover="hover"
            >
              <MdCreate className='notecard-11'/>
            </motion.button>
            <motion.button
              className='notecard-12'
              onClick={onDelete}
              variants={buttonVariants}
              whileHover="hover"
            >
              <MdDelete className='notecard-13'/>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoteCard
