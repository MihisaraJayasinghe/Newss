'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidesbars'; // Left sidebar with news items
import NewsSection from '../../components/newssecsection'; // Middle section
import ReactPlayer from 'react-player';
import dayjs from 'dayjs'; // Library to handle date operations

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
    tag: '', // Added tag field
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
          tag: '', // Reset tag
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

  // Filter the Pradana Puwath articles and separate the pinned one
  const pradanaPuwathNews = newsItems.filter((item) => item.tag.includes('Pradana Puwath'));
  const nonPinnedPradanaPuwathNews = pradanaPuwathNews.filter((item) => item.stype !== 'pinned');
  
  const sidebarNewsItems = newsItems.filter((item) => item.tag.includes('Unusum Puwath'));
  
  // Function to filter news by time (less than 24 hours ago)
  const recentNewsItems = newsItems.filter((item) => {
    const oneDayAgo = dayjs().subtract(1, 'day');
    return dayjs(item.publishedAt || item.createdAt).isAfter(oneDayAgo); // Check if news is less than a day old
  });

  return (
    <div>
      {/* Header and Navbar */}
      <Header />
      <Navbar />

      {/* Page Layout with 3 sections: Sidebar, NewsSection, and RightComponent */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Left */}
        <div className="w-full lg:w-1/5 p-4 bg-gray-200 m-5 rounded-lg">
          <a className="text-2xl font-bold">Unusum Puwath</a>
          <Sidebar newsItems={sidebarNewsItems} />
        </div>

        {/* Main News Section and News Grid - Center */}
        <div className="flex-1   bg-gray-200 p-4">
          {/* Pinned News Section */}
          {pinnedNewsItem && (
            <div className="mb-6 p-6 bg-white border-4 border-blue-500 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Main News</h2>
              <h2 className="text-3xl font-bold mb-4">{pinnedNewsItem.title}</h2>
              <div className="flex flex-col md:flex-row gap-4">
                {pinnedNewsItem.videoUrl && pinnedNewsItem.mediaPreference === 'video' ? (
                  <div className="w-full md:w-1/2">
                    <ReactPlayer
                      url={pinnedNewsItem.videoUrl}
                      playing
                      controls
                      width="100%"
                      height="auto"
                    />
                  </div>
                ) : pinnedNewsItem.imageUrl ? (
                  <img
                    src={pinnedNewsItem.imageUrl}
                    alt={pinnedNewsItem.title}
                    className="w-full md:w-1/2 object-cover rounded-md"
                  />
                ) : (
                  <p>No media available</p>
                )}
                <div className="flex-1">
                  <p className="text-gray-600">{pinnedNewsItem.content.substring(0, 200)}...</p>

                  {/* Unpin Button */}
                  <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => setPinnedNewsItem(null)}
                  >
                    Unpin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* News Grid Section for "Pradana Puwath" */}
          <div className="border-2 border-black p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Pradana Puwath</h2>
            <NewsSection newsItems={nonPinnedPradanaPuwathNews} />
          </div>

          {/* News Grid Section for "Wigasa Puwath" */}
          <div className="border-2 border-black p-6 bg-white rounded-md shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Wigasa Puwath</h2>
            <NewsSection newsItems={recentNewsItems} />
          </div>

          {/* Add News Form */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold mb-4">Add News</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-gray-700">Tag</label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value.split(',') })}
                  className="w-full p-2 border border-gray-300 rounded"
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
              >
                Add News
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className=" w-1/5 bg-gray-100 p-4">
        <h3 className="font-bold text-lg mb-4">Other News</h3>

{nonPinnedPradanaPuwathNews.length > 0 ? (
  nonPinnedPradanaPuwathNews.map((item, index) => (
    <div key={index} className="mb-4">
      <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
      <p className="text-gray-600">
        {item.content.substring(0, 100)}... {/* Limit the content preview */}
      </p>


      {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-24 object-cover rounded-md mb-2"
          />
      )}



     
      <a href={item.link || '#'} className="text-blue-500 text-sm">
        Read more
      </a>
    </div>
  ))
) : (
  <p className="text-gray-600">No other news available</p>
)}
</div>
      </div>
    </div>
  );
}