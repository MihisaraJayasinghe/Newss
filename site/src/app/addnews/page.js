'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import ReactPlayer from 'react-player';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Track search input
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    imageUrl: '',
    videoUrl: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newNews = await response.json();
        setNewsItems((prevItems) => [...prevItems, newNews.data]);
        setFormData({
          title: '',
          content: '',
          category: '',
          author: '',
          imageUrl: '',
          videoUrl: '',
        });
      } else {
        console.error('Error submitting news article:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting news article:', error);
    }
  };

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

    const fetchPinnedNews = async () => {
      try {
        const response = await fetch('/api/news?pinned=true');
        if (response.ok) {
          const data = await response.json();
          setPinnedNewsItem(data.data || null);
        }
      } catch (error) {
        console.error('Error fetching pinned news:', error);
      }
    };

    fetchNews();
    fetchPinnedNews();
  }, []);

  const handlePin = async (item) => {
    try {
      await fetch(`/api/news`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item._id, action: 'pin' }),
      });

      setPinnedNewsItem(item);
      setNewsItems((prevItems) =>
        prevItems.map((news) =>
          news._id === item._id ? { ...news, stype: 'pinned' } : { ...news, stype: '' }
        )
      );
    } catch (error) {
      console.error('Error pinning news item:', error);
    }
  };

  const handleUnpin = async () => {
    try {
      if (pinnedNewsItem) {
        await fetch(`/api/news`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: pinnedNewsItem._id, action: 'unpin' }),
        });
        setPinnedNewsItem(null);
        setNewsItems((prevItems) =>
          prevItems.map((news) =>
            news._id === pinnedNewsItem._id ? { ...news, stype: '' } : news
          )
        );
      }
    } catch (error) {
      console.error('Error unpinning news item:', error);
    }
  };

  // Filter news items based on title only
  const filteredNewsItems = newsItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <Navbar />

      <div className="flex flex-col items-center mt-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-3/4 md:w-1/2 mb-6"
        />

        {/* Display Pinned News - Smaller Card */}
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
          {filteredNewsItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg p-4">
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
            </div>
          ))}
        </div>
      </div>

      {/* Add News Form */}
      <div className="p-6 mt-6 bg-white rounded-lg shadow-md border max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add News</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Video URL</label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Add News
          </button>
        </form>
      </div>
    </div>
  );
}
