'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';

export default function NewsAddForm() {
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newsItems, setNewsItems] = useState([]); // Store fetched news items
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    imageUrl: '',
    tag: '',
    videoUrl: '',
  });
  const [editingId, setEditingId] = useState(null); // ID of the news being edited
  const [activeTab, setActiveTab] = useState('all'); // Control the active tab
  const [selectedCategory, setSelectedCategory] = useState(''); // For filtering by category
  const [selectedTag, setSelectedTag] = useState(''); // For filtering by tag

  // Hard-coded categories and tags
  const categories = ['Politics', 'wyapara puwath', 
  'deshiya puwath',  
  'wideshiya']; // Sinhala names for categories
  const tags = ['Unusum Puwath', 'Pradana Puwath' ,]; // Example tags

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // Hard-coded credentials
    if (username === 'admin' && password === '1234') {
      setIsAdmin(true); // Allow access if credentials are correct
    } else {
      alert('Invalid credentials!'); // Show alert for invalid login
    }
  };

  // Fetch news from API
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNewsItems(data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchNews(); // Fetch news only if admin is authenticated
    }
  }, [isAdmin]);

  // Handle form submission for adding news
  const handleAddSubmit = async (e) => {
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
        setFormData({
          title: '',
          content: '',
          category: '',
          author: '',
          imageUrl: '',
          tag: '',
          videoUrl: '',
        });
        alert('News added successfully!');
        fetchNews(); // Refresh the news list
      } else {
        console.error('Error submitting news:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting news:', error);
    }
  };

  // Handle form submission for updating news
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editingId) {
      alert('No news selected for editing!');
      return;
    }

    try {
      const response = await fetch(`/api/addnewsform?id=${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          imageUrl: formData.imageUrl,
          videoUrl: formData.videoUrl,
          tag: formData.tag.split(',').map(tag => tag.trim()), // Ensure tags are saved as an array
        }),
      });

      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          category: '',
          author: '',
          imageUrl: '',
          tag: '',
          videoUrl: '',
        });
        alert('News updated successfully!');
        setEditingId(null); // Reset the editing state
        setActiveTab('all'); // Switch back to "View News" tab after update
        fetchNews(); // Refresh the news list
      } else {
        console.error('Error updating news:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  // Handle selecting a news item to edit
  const handleEdit = (news) => {
    setEditingId(news._id); // Set the ID of the news being edited
    setFormData({
      title: news.title,
      content: news.content,
      category: news.category,
      author: news.author,
      imageUrl: news.imageUrl,
      tag: news.tag.join(', '), // Convert the tag array back to a comma-separated string for the input
      videoUrl: news.videoUrl,
    });
    setActiveTab('add'); // Switch to "Add/Edit News" tab
  };

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'add') {
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        category: '',
        author: '',
        imageUrl: '',
        tag: '',
        videoUrl: '',
      });
    }
  };

  // Filter news items by category or tag
  const filteredNewsItems = newsItems.filter(news => {
    const tagMatch = selectedTag
      ? news.tag.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase())) // Check if any tag matches the search
      : true;

    return (
      (!selectedCategory || news.category === selectedCategory) && tagMatch
    );
  });

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">NEWS WEB</h1>
      <Header />
      <Navbar />

      {/* Tab Navigation */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleTabClick('all')}
          className={`px-4 py-2 ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          View News
        </button>
        <button
          onClick={() => handleTabClick('add')}
          className={`px-4 py-2 ${activeTab === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {editingId ? 'Edit News' : 'Add News'}
        </button>
      </div>

      {activeTab === 'add' && (
        <form className="space-y-4 mt-6">
          {/* Input fields for form */}
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
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Tag</label>
            <select
              name="tag"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Tag</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
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

          <div className="flex space-x-4">
            <button
              onClick={handleAddSubmit}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              type="submit"
            >
              Add News
            </button>

            <button
              onClick={handleUpdateSubmit}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              type="submit"
            >
              Update News
            </button>
          </div>
        </form>
      )}

      {activeTab === 'all' && (
        <div className="mt-6">
          {/* Filters for category and tag */}
          <div className="flex space-x-4 mb-4">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Filter by category</option>
              {[...new Set(newsItems.map(news => news.category))].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter by tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Display filtered news items */}
          {filteredNewsItems.length === 0 ? (
            <p>No news available.</p>
          ) : (
            <ul className="space-y-4">
              {filteredNewsItems.map((news) => (
                <li key={news._id} className="border p-4 rounded-lg">
                  <h3 className="text-xl font-bold">{news.title}</h3>
                  <p>{news.content}</p>
                  <p><strong>Category:</strong> {news.category}</p>
                  <p><strong>Author:</strong> {news.author}</p>
                  <p><strong>Tags:</strong> {news.tag.join(', ')}</p>
                  <button
                    onClick={() => handleEdit(news)}
                    className="text-blue-500 mt-2"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
