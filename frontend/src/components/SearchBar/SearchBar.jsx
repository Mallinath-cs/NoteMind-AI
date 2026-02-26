import React, { useEffect, useState } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import './SearchBar.css'

const Searchbar = ({ value, onChange, handleSearch, onClearSearch }) => {

  const [query, setQuery] = useState(value)

  // Keep internal state in sync with parent value
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Debounce logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() === '') {
        onClearSearch()
      } else {
        handleSearch(query)
      }
    }, 300) // 300ms delay

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange(e)
  }

  return (
    <div className='searchbar-01'>
      <input
        type="text"
        placeholder='Search Notes'
        className='search-input'
        value={query}
        onChange={handleInputChange}
      />

      {query && (
        <IoMdClose
          className='search-close'
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass className='search-magnify' />
    </div>
  )
}

export default Searchbar