import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'
import './Tag.css'
const Tag = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => setInputValue(e.target.value);

  const addNewTag = () => {
    if(inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  }
  const handleKeyDown = (e) => {
    if(e.key === "Enter") addNewTag();
  }
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }
  return (
    <div>
      {tags?.length > 0 && (
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span
            key={index}
            className='badge'
            >
            {tag}
            <button
            className='tag-button'
            onClick={() => handleRemoveTag(tag)}
            >
              <MdClose />
            </button>
            </span>
          ))}
        </div>
      )}
      <div className="tags-03">
        <input
         type="text"
         value={inputValue}
         className='tags-input'
         placeholder='Add tags'
         onChange={handleInputChange}
         onKeyDown={handleKeyDown}
          />
          <button
          className='tags-button-01'
          onClick={addNewTag}
          >
            <MdAdd className='tags-add-btn'/>
          </button>
      </div>
    </div>
  )
}

export default Tag
