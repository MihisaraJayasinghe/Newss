'use client';
 
import { useState, useEffect } from 'react';
import Header from '../../../../components/header'; // Adjust the path as needed
import Navbar from '../../../../components/navbar'; // Adjust the path as needed
import Link from 'next/link';

export default function NewsDetail({ params }) {
  const [newsItem, setNewsItem] = useState(null);
  const [sidebarNewsItems, setSidebarNewsItems] = useState([]);
  const { id } = params; // Get the dynamic ID from the params

  // Fetch the main news article details using the `id` from the URL
  useEffect(() => {
    if (id) {
      const fetchNewsDetail = async () => {
        try {
          const response = await fetch(`/api/news?id=${id}`); // Fetch the news by `id`
          const data = await response.json();
          if (data.success) {
            setNewsItem(data.data); // Set the news data to state
          } else {
            console.error('Error fetching news details:', data.message);
          }
        } catch (error) {
          console.error('Error fetching news article:', error);
        }
      };

      fetchNewsDetail();
    }
  }, [id]); // Trigger this effect whenever `id` changes

  // Fetch additional news items for the sidebar
  useEffect(() => {
    const fetchSidebarNews = async () => {
      try {
        const response = await fetch('/api/news'); // Fetch all news for the sidebar
        const data = await response.json();
        if (data.success) {
          setSidebarNewsItems(data.data.slice(0, 5)); // Limit to 5 news items
        }
      } catch (error) {
        console.error('Error fetching sidebar news:', error);
      }
    };

    fetchSidebarNews();
  }, []);

  if (!newsItem) {
    return <p>Loading news details...</p>; // Display loading state while fetching data
  }

  return (
    <div>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 mt-10 flex">
        {/* Main news content */}
        <div className="w-full lg:w-3/4 pr-4">
          <h1 className="text-4xl font-bold mb-6">{newsItem.title}</h1>
          {newsItem.imageUrl && (
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="w-full h-60 object-cover mb-6"
            />
          )}
          {newsItem.videoUrl && (
            <div className="mb-6">
              <video controls className="w-full h-auto">
                <source src={newsItem.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <p className="text-lg text-gray-700 mb-6">{newsItem.content}</p>
          <p className="text-gray-500 text-sm">Published by: {newsItem.author}</p>
          <p className="text-gray-500 text-sm">
            Published at: {new Date(newsItem.publishedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Scrollable Sidebar with other news */}
        <div className="w-full lg:w-1/4 bg-gray-100 p-4 max-h-screen overflow-y-auto"> {/* Scrollable section */}
          <h3 className="font-bold text-lg mb-4">Other News</h3>
          {sidebarNewsItems.length > 0 ? (
            sidebarNewsItems.map((item, index) => (
              <Link key={index} href={`/newsdetail/${item._id}`} passHref> 
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
                <a href={`/newsdetail/${item._id}`} className="text-blue-500 text-sm">
                  Read more
                </a>
              </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No other news available</p>
          )}
        </div>
      </div>
    </div>
  );
}
