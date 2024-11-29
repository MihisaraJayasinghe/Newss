'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';

export default function NewsAddForm() {
  const [newsItems, setNewsItems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    stype: '', // Pin status
    live: '', // Live status
    tag: [],
    imageUrl: '',
    videoUrl: '',
    mediaPreference: 'image',
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'add'
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all news
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/addnewsform');
      const data = await response.json();
      setNewsItems(data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle "Go Live" Toggle
  const toggleLiveStatus = async (id, isLive) => {
    try {
      const response = await fetch(`/api/addnewsform?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ live: isLive ? '' : 'live' }),
      });
      if (response.ok) {
        fetchNews();
      } else {
        console.error('Error toggling live status:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling live status:', error);
    }
  };

  // Handle Pin News
  const handlePin = async (id) => {
    try {
      // Unpin previously pinned news
      await fetch('/api/addnewsform', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stype: '' }),
      });

      // Pin the current news
      const response = await fetch(`/api/addnewsform?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stype: 'pinned' }),
      });
      if (response.ok) {
        fetchNews();
      } else {
        console.error('Error pinning news:', response.statusText);
      }
    } catch (error) {
      console.error('Error pinning news:', error);
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm ? `?title=${searchTerm}` : '';
    fetchNews(query);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />
      <Navbar />
      <div className="flex space-x-4 mt-4 border-b-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 ${
            activeTab === 'dashboard' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 ${
            activeTab === 'add' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Add/Edit News
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="mt-6">
          <form onSubmit={handleSearch} className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Search
            </button>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {newsItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
              >
                <img
                  src={item.imageUrl || '/placeholder-image.jpg'}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-grow ml-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleLiveStatus(item._id, item.live === 'live')}
                    className={`px-4 py-2 rounded ${
                      item.live === 'live' ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                  >
                    {item.live === 'live' ? 'Remove Live' : 'Go Live'}
                  </button>
                  <button
                    onClick={() => handlePin(item._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Pin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}