'use client'
import React, { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Using FontAwesome icons

export default function BookMarkBtn() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(prevState => !prevState);
  };

  return (
    <button 
      onClick={toggleBookmark}
      style={{
        backgroundColor: 'transparent',
        border: '2px solid #007BFF',
        borderRadius: '5px',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        color: isBookmarked ? '#FFD700' : '#007BFF',
        transition: 'all 0.3s ease-in-out',
      }}
      title={isBookmarked ? 'Unbookmark' : 'Bookmark'}
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      <span style={{ marginLeft: '8px' }}>
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </button>
  );
}







