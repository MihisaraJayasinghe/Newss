'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import dayjs from 'dayjs';





export default function NewsAddForm() {
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    stype: '',
    live: '',
    tag: [],
    imageUrl: '',
    videoUrl: '',
    mediaPreference: 'image',
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'add'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    tag: '',
  });

  const now = dayjs();

  const getTimeDisplay = (timestamp) => {
    const publishedTime = dayjs(timestamp);
    if (!publishedTime.isValid()) {
      console.warn('Invalid date:', timestamp);
      return 'Unknown time';
    }

    const diffInMinutes = now.diff(publishedTime, 'minute');
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${now.diff(publishedTime, 'hour')} hours ago`;
    return publishedTime.format('YYYY/MM/DD h:mm A');
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNewsItems(data.data || []);
      setFilteredNews(data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFilter = () => {
    let filtered = newsItems;

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    if (filters.date) {
      const selectedDate = dayjs(filters.date).startOf('day');
      filtered = filtered.filter((item) =>
        dayjs(item.publishedAt).isSame(selectedDate, 'day')
      );
    }

    if (filters.tag) {
      filtered = filtered.filter((item) =>
        item.tag.some((tag) => tag.toLowerCase().includes(filters.tag.toLowerCase()))
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [filters, searchTerm, newsItems]);

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.author,
      stype: item.stype,
      live: item.live,
      tag: item.tag,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      mediaPreference: item.mediaPreference,
    });
    setEditingId(item._id);
    setActiveTab('add');
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/addnewsform?id=${editingId}` : '/api/addnewsform';
      const body = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl,
        tag: formData.tag,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(editingId ? 'News updated successfully!' : 'News added successfully!');
        setFormData({
          title: '',
          content: '',
          category: '',
          author: '',
          imageUrl: '',
          videoUrl: '',
          tag: [],
        });
        setEditingId(null);
        setActiveTab('dashboard');
        fetchNews();
      } else {
        const error = await response.json();
        console.error('Error submitting news:', error.message || response.statusText);
        alert(`Error: ${error.message || 'Failed to submit news.'}`);
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this news?')) {
      try {
        const response = await fetch(`/api/news?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('News deleted successfully!');
          fetchNews();
        } else {
          console.error('Error deleting news:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };


  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

const handleLogin = (e) => {
  e.preventDefault();
  if (loginCredentials.username === 'admin' && loginCredentials.password === '1234') {
    setIsAuthenticated(true);
  } else {
    alert('Invalid credentials!');
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setLoginCredentials({ ...loginCredentials, [name]: value });
};

if (!isAuthenticated) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginCredentials.username}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginCredentials.password}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

  const toggleLiveStatus = async (id, isLive) => {
    try {
      const response = await fetch(`/api/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, live: isLive ? '' : 'live' }),
      });

      if (response.ok) {
        alert(`News ${isLive ? 'unmarked' : 'marked'} as live`);
        fetchNews();
      } else {
        console.error('Error toggling live status:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling live status:', error);
    }
  };

  const handlePin = async (id) => {
    try {
      await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stype: '' }),
      });

      const response = await fetch(`/api/news?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stype: 'pinned' }),
      });

      if (response.ok) {
        alert('News pinned successfully!');
        fetchNews();
      } else {
        console.error('Error pinning news:', response.statusText);
      }
    } catch (error) {
      console.error('Error pinning news:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />
      <Navbar />
      <div className="flex justify-center mt-4 flex-col md:flex-row">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setEditingId(null);
          }}
          className={`px-6 py-2 rounded-t-lg ${
            activeTab === 'dashboard' ? 'bg-gray-200 text-blue-600 font-bold' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-2 rounded-t-lg ${
            activeTab === 'add' ? 'bg-gray-200 text-blue-600 font-bold' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {editingId ? 'Edit News' : 'Add News'}
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="mt-0 bg-gray-200 p-4 rounded-b-lg">
          <form className="flex flex-col space-y-4 mb-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
              >
                <option value="">Filter by Category</option>
                {[...new Set(newsItems.map((item) => item.category))].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Filter by tag"
                value={filters.tag}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
              />
            </div>
          </form>

          <div className="grid xl:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
  {filteredNews.map((item) => (
    <div
      key={item._id}
      className="p-4 border rounded-lg bg-white shadow-sm flex xl:flex-row flex-col items-start"
    >
      {/* News Image */}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-32 h-24 object-cover rounded-md mb-2 xl:mb-0 xl:mr-4"
        />
      )}
      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        <p className="text-sm text-blue-500">{getTimeDisplay(item.publishedAt)}</p>
        <p className="text-sm text-gray-500">Tags: {item.tag.join(', ')}</p>
      </div>
      {/* Action Buttons */}
      <div className="mt-4 m-2 xl:mt-0   space-x-2">
        <button
          onClick={() => toggleLiveStatus(item._id, item.live === 'live')}
          className={`px-4 py-2 sm:m-2 rounded ${
            item.live === 'live' ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {item.live === 'live' ? 'Unlive' : 'Go Live'}
        </button>
        <button
          onClick={() => handlePin(item._id)}
          className="bg-green-500 sm:m-2 text-white px-4 py-2 rounded"
        >
          Pin
        </button>
        <button
          onClick={() => handleEdit(item)}
          className="bg-blue-500 sm:m-2 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(item._id)}
          className="bg-red-500 sm:m-2 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
        </div>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleAddEditSubmit} className="bg-gray-200 p-4 rounded-b-lg space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {['Politics', 'Sports', 'Technology', 'Entertainment', 'World', 'Local'].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={formData.tag.join(', ')}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value.split(',').map((tag) => tag.trim()) })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Video URL"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update News' : 'Add News'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  content: '',
                  category: '',
                  author: '',
                  stype: '',
                  live: '',
                  tag: [],
                  imageUrl: '',
                  videoUrl: '',
                  mediaPreference: 'image',
                });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}
    </div>
  );
}