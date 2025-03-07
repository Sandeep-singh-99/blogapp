// 'use client'
// import React, { useState } from 'react';
// import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Using FontAwesome icons


// interface BookMarkBtnProps {
//   isBookmarked: string;
// }

// export default function BookMarkBtn({ Bookmarked}: BookMarkBtnProps) {
//   const [isBookmarked, setIsBookmarked] = useState(false);

//   const toggleBookmark = () => {
//     setIsBookmarked(prevState => !prevState);
//   };

//   return (
//     <button 
//       onClick={toggleBookmark}
//       style={{
//         backgroundColor: 'transparent',
//         border: '2px solid #007BFF',
//         borderRadius: '5px',
//         padding: '10px 15px',
//         display: 'flex',
//         alignItems: 'center',
//         cursor: 'pointer',
//         fontSize: '16px',
//         fontWeight: '500',
//         color: isBookmarked ? '#FFD700' : '#007BFF',
//         transition: 'all 0.3s ease-in-out',
//       }}
//       title={isBookmarked ? 'Unbookmark' : 'Bookmark'}
//     >
//       {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
//       <span style={{ marginLeft: '8px' }}>
//         {isBookmarked ? 'Bookmarked' : 'Bookmark'}
//       </span>
//     </button>
//   );
// }



'use client';

import useSWR, { mutate } from 'swr';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { showError, showSuccess } from '@/utils/toast';
import { useState } from 'react';

interface BookMarkBtnProps {
  id: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BookMarkBtn({ id }: BookMarkBtnProps) {
  const { data, error } = useSWR(`/api/bookmark/${id}`, fetcher);
  const [loading, setLoading] = useState(false);
  const isBookmarked = data?.isBookmarked || false;

  if (error) return <p className="text-red-500 text-sm">Error loading bookmark status</p>;

  const toggleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/bookmark/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update bookmark');

      showSuccess({ message: data.message });

      mutate(`/api/bookmark/${id}`, { isBookmarked: !isBookmarked }, false);
    } catch (error) {
      showError({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300
        ${isBookmarked ? 'border-yellow-500 bg-yellow-100 text-yellow-700' : 'border-blue-500 bg-blue-100 text-blue-700'}
        hover:shadow-md active:scale-95 disabled:opacity-50`}
      disabled={loading}
      title={isBookmarked ? 'Bookmark' : 'Unbookmark'}
    >
      {isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark className="text-blue-500" />}
      <span className="font-medium">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  );
}
