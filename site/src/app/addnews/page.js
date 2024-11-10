'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import ReactPlayer from 'react-player';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    imageUrl: '',
    videoUrl: '',
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  const toggleLiveStatus = async (itemId, isCurrentlyLive) => {
    const updatedStatus = isCurrentlyLive ? null : 'live';

    try {
      const response = await fetch('/api/status/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId, live: updatedStatus }),
      });

      if (response.ok) {
        setNewsItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, live: updatedStatus } : item
          )
        );
      } else {
        console.error('Error updating live status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating live status:', error);
    }
  };

  const handlePin = (item) => {
    setPinnedNewsItem(item);
    setNewsItems((prevItems) =>
      prevItems.map((news) =>
        news._id === item._id ? { ...news, stype: 'pinned' } : { ...news, stype: '' }
      )
    );
  };

  const handleUnpin = () => {
    if (pinnedNewsItem) {
      setNewsItems((prevItems) =>
        prevItems.map((news) =>
          news._id === pinnedNewsItem._id ? { ...news, stype: '' } : news
        )
      );
      setPinnedNewsItem(null);
    }
  };

  return (
    <div>
      <Header />
      <Navbar />

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded w-3/4 md:w-1/2 mb-6"
      />

      {/* Display Pinned News */}
      {pinnedNewsItem && (
        <div className="w-full mb-6 p-4 bg-white border-2 border-blue-500 rounded-lg shadow-md max-w-md">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Pinned News</h2>
          <div className="w-full">
            {pinnedNewsItem.videoUrl && pinnedNewsItem.mediaPreference === 'video' ? (
              <ReactPlayer
                url={pinnedNewsItem.videoUrl}
                playing
                controls
                width="100%"
                height="200px"
                className="rounded-lg mb-2"
              />
            ) : pinnedNewsItem.imageUrl ? (
              <img
                src={pinnedNewsItem.imageUrl}
                alt={pinnedNewsItem.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            ) : (
              <p>No media available</p>
            )}
            <h2 className="text-xl font-bold mb-2">{pinnedNewsItem.title}</h2>
            <p className="text-gray-600 mb-2">{pinnedNewsItem.content.substring(0, 100)}...</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleUnpin}
            >
              Unpin
            </button>
          </div>
        </div>
      )}

      {/* News Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-6">
        {newsItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-lg p-4 relative">
            {/* Display "Live" badge if the item is live */}
            {item.live === 'live' && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                LIVE
              </span>
            )}
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>

            {/* Display video or image */}
            {item.videoUrl ? (
              <ReactPlayer
                url={item.videoUrl}
                playing={false}
                controls
                width="100%"
                height="200px"
                className="rounded-lg mb-4"
              />
            ) : item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <p>No media available</p>
            )}
            <p>{item.content.substring(0, 100)}...</p>
            <p><strong>Author:</strong> {item.author}</p>
            <p><strong>Category:</strong> {item.category}</p>

            {/* Pin button for each news item */}
            <button
              onClick={() => handlePin(item)}
              className={`mt-2 px-4 py-2 rounded ${
                item.stype === 'pinned' ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {item.stype === 'pinned' ? 'Pinned' : 'Pin'}
            </button>

            {/* Live Toggle Button */}
            <button
              onClick={() => toggleLiveStatus(item._id, item.live === 'live')}
              className={`mt-2 px-4 py-2 rounded ${
                item.live === 'live' ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
              } text-white ml-2`}
            >
              {item.live === 'live' ? 'Remove Live' : 'Go Live'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
