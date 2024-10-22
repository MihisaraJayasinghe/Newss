'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import Sidebar from '../../../components/sidesbars'; // Left sidebar with news items
import NewsSection from '../../../components/newssecsection'; // Middle section
import ReactPlayer from 'react-player';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null); // Track the pinned news item
  const [selectedNews, setSelectedNews] = useState(null); // Track the currently selected news
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
        body: JSON.stringify(formData), // Send form data as JSON
      });

      if (response.ok) {
        const newNews = await response.json();
        setNewsItems((prevItems) => [...prevItems, newNews.data]); // Add the new news to the list
        setFormData({
          title: '',
          content: '',
          category: '',
          author: '',
          imageUrl: '',
          videoUrl: '',
        }); // Reset form
      } else {
        console.error('Error submitting news article:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting news article:', error);
    }
  };

  useEffect(() => {
    // Fetch all news articles from the API
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data.data || []); // Ensure data is an array
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    // Fetch the pinned news article from the API
    const fetchPinnedNews = async () => {
      try {
        const response = await fetch('/api/news?pinned=true');
        if (response.ok) {
          const data = await response.json();
          setPinnedNewsItem(data.data || null); // Set the pinned item
        }
      } catch (error) {
        console.error('Error fetching pinned news:', error);
      }
    };

    fetchNews();
    fetchPinnedNews();
  }, []);

  // Function to pin a news item (send it to the database)
  const handlePin = async (item) => {
    try {
      await fetch(`/api/news`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item._id, action: 'pin' }),
      });
      setPinnedNewsItem(item); // Update the pinned item locally
    } catch (error) {
      console.error('Error pinning news item:', error);
    }
  };

  // Function to unpin the current pinned item (update in the database)
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
        setPinnedNewsItem(null); // Unpin locally
      }
    } catch (error) {
      console.error('Error unpinning news item:', error);
    }
  };

  // Function to toggle between video and image, and save preference to database
  const handleToggleMedia = async () => {
    const newPreference = pinnedNewsItem.mediaPreference === 'video' ? 'image' : 'video';

    try {
      await fetch(`/api/news`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: pinnedNewsItem._id, mediaPreference: newPreference }),
      });
      setPinnedNewsItem({ ...pinnedNewsItem, mediaPreference: newPreference }); // Update the state
    } catch (error) {
      console.error('Error updating media preference:', error);
    }
  };

  // Separate remaining news items excluding the pinned one
  const remainingNewsItems = newsItems.filter((item) => {
    return pinnedNewsItem ? item._id !== pinnedNewsItem._id : true;
  });

  // Function to handle sidebar click and highlight the selected news
  const handleSidebarClick = (item) => {
    setSelectedNews(item._id); // Highlight the clicked news
    document.getElementById(item._id).scrollIntoView({ behavior: 'smooth' }); // Scroll to the corresponding news section
  };

  return (
    <div>
      {/* Header and Navbar */}
      <Header />
      <Navbar />

      {/* Page Layout with 3 sections: Sidebar, NewsSection, and RightComponent */}
      <div className="flex">
        {/* Sidebar - Left */}
        <div className="w-1/5 ml-20 mr-10 mt-20 rounded-md p-4 bg-gray-200">
          <a className="text-2xl ml-2 font-bold h-10">Unusum Puwath</a>
          <Sidebar
            newsItems={newsItems}
            onClick={handleSidebarClick}
            selectedNews={selectedNews}
          />
        </div>

        {/* Main News Section and News Grid - Center */}
        <div className="flex-1 bg-gray-200 mt-20">
          {/* Pinned News Section with its own border and rounded corners */}
          {pinnedNewsItem && (
            <div className="w-full mb-6 p-6 bg-white border-4 border-blue-500 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Main News</h2>
              <h2 className="text-3xl font-bold mb-4">{pinnedNewsItem.title}</h2>
              <div className="flex w-full gap-4">
                {pinnedNewsItem.videoUrl && pinnedNewsItem.mediaPreference === 'video' ? (
                 <div className="w-1/2 ">
                 <ReactPlayer
                  
                    url={pinnedNewsItem.videoUrl}
                    playing
                    controls
                    width="100%"
                    className=" "
                    height="auto"
                  />
                  </div>
                ) : pinnedNewsItem.imageUrl ? (
                  <img
                    src={pinnedNewsItem.imageUrl}
                    alt={pinnedNewsItem.title}
                    className="w-1/2 object-cover rounded-md"
                  />
                ) : (
                  <p>No media available</p>
                )}
                <div className=" w-1/2">
                  <p className="text-gray-600 ">{pinnedNewsItem.content.substring(0, 200)}...</p>

                  {/* Toggle media button */}
                  {pinnedNewsItem.videoUrl && (
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={handleToggleMedia}
                    >
                      {pinnedNewsItem.mediaPreference === 'video' ? 'Show Image' : 'Show Video'}
                    </button>
                  )}

                  {/* Unpin Button */}
                  <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleUnpin}
                  >
                    Unpin
                  </button>
                  
                </div>
              </div>
              <p className="text-gray-600">{pinnedNewsItem.content.substring(0, 200)}...</p>
            </div>
          )}

          {/* News Grid Section with its own border and rounded corners */}
          <div className="border-2 border-black p-6 m-5 bg-white rounded-md shadow-md">
            <NewsSection
              newsItems={remainingNewsItems}
              onPin={handlePin}
              selectedNews={selectedNews}
            />
          </div>

          {/* Add News Form at the bottom */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md border">
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

        {/* Right Sidebar */}
        <div className="w-1/5 mr-20 ml-10 mt-20 bg-gray-100">
          {/* You can add content to the right sidebar here */}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Related News</h3>
            <p className="text-gray-600">You can add widgets, ads, or any other content in this section.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
