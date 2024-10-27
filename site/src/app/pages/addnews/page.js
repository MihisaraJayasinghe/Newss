'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import Sidebar from '../../../components/sidesbars';
import NewsSection from '../../../components/newssecsection';
import ReactPlayer from 'react-player';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
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
      setPinnedNewsItem({ ...pinnedNewsItem, mediaPreference: newPreference });
    } catch (error) {
      console.error('Error updating media preference:', error);
    }
  };

  const remainingNewsItems = newsItems.filter((item) => {
    return pinnedNewsItem ? item._id !== pinnedNewsItem._id : true;
  });

  const handleSidebarClick = (item) => {
    setSelectedNews(item._id);
    document.getElementById(item._id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Header />
      <Navbar />

      <div className="flex">
        <div className="w-1/5 ml-20 mr-10 mt-20 rounded-md p-4 bg-gray-200">
          <a className="text-2xl ml-2 font-bold h-10">Unusum Puwath</a>
          <Sidebar
            newsItems={newsItems}
            onClick={handleSidebarClick}
            selectedNews={selectedNews}
          />
        </div>

        <div className="flex-1 bg-gray-200 mt-20">
          {pinnedNewsItem && (
            <div className="w-full mb-6 p-6 bg-white ml-auto mr-auto border-4 border-blue-500 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Main News</h2>
              <div className="flex w-full">
                {pinnedNewsItem.videoUrl && pinnedNewsItem.mediaPreference === 'video' ? (
                  <ReactPlayer
                    url={pinnedNewsItem.videoUrl}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    className="rounded-lg w-72 overflow-hidden bg-blue-500 h-60 mr-5"
                  />
                ) : pinnedNewsItem.imageUrl ? (
                  <img
                    src={pinnedNewsItem.imageUrl}
                    alt={pinnedNewsItem.title}
                    className="w-20 h-20 text-justify xl:w-72 mt-2 xl:h-60 object-cover rounded-md"
                  />
                ) : (
                  <p>No media available</p>
                )}
                <div className="w-full">
                  <h2 className="text-sm text-justify xl:text-2xl font-bold mb-4">{pinnedNewsItem.title}</h2>
                  <p className="text-gray-600 text-justify">{pinnedNewsItem.content.substring(0, 200)}...</p>

                  {pinnedNewsItem.videoUrl && (
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={handleToggleMedia}
                    >
                      {pinnedNewsItem.mediaPreference === 'video' ? 'Show Image' : 'Show Video'}
                    </button>
                  )}

                  <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleUnpin}
                  >
                    Unpin
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-2 border-black p-6 m-5 bg-white rounded-md shadow-md">
            <NewsSection
              newsItems={remainingNewsItems}
              onPin={handlePin}
              selectedNews={selectedNews}
            />
          </div>

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

        <div className="w-1/5 mr-20 ml-10 mt-20 bg-gray-100">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Related News</h3>
            <p className="text-gray-600">You can add widgets, ads, or any other content in this section.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
