// app/newsdetail/[id]/page.js

'use client';

import { useState, useEffect } from 'react';
import Header from '../../../../components/header'
import Navbar from '../../../../components/navbar'; // Ensure correct path and case
import Link from 'next/link';

export default function NewsDetail({ params }) {
  const [newsItem, setNewsItem] = useState(null);
  const [sidebarNewsItems, setSidebarNewsItems] = useState([]);
  const { id } = params; // Get the dynamic ID from the params
  const [error, setError] = useState(null);

  // Function to calculate relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  };

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
            setError('Failed to load news details.');
          }
        } catch (error) {
          console.error('Error fetching news article:', error);
          setError('An unexpected error occurred.');
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

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header/>
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <p className="text-red-500 text-lg">{error}</p>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4">
          &copy; {new Date().getFullYear()} Your News Website. All rights reserved.
        </footer>
      </div>
    );
  }

  // Handle loading state
  if (!newsItem) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <p className="text-gray-500 text-lg">Loading news details...</p>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4">
          &copy; {new Date().getFullYear()} Your News Website. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <Navbar/>
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        {/* Main news content */}
        <article className="w-full lg:w-3/4 lg:pr-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-800">
            {newsItem.title}
          </h1>
          {newsItem.imageUrl && (
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="w-full h-64 lg:h-96 object-cover rounded-md mb-6"
              loading="lazy" // Lazy load the image for better performance
            />
          )}
          {newsItem.videoUrl && (
            <div className="mb-6">
              <video
                controls
                className="w-full h-auto rounded-md"
                preload="metadata"
              >
                <source src={newsItem.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <section className="text-base lg:text-lg text-gray-700 mb-6">
            {newsItem.content}
          </section>
          <div className="text-gray-500 text-sm">
            <p>Published by: {newsItem.author}</p>
            <p>Published: {getRelativeTime(newsItem.publishedAt)}</p>
          </div>
        </article>

        {/* Scrollable Sidebar with other news */}
        <aside className="w-full lg:w-1/4 bg-gray-100 p-6 rounded-md mt-8 lg:mt-0 lg:max-h-screen lg:overflow-y-auto">
          <h3 className="font-bold text-2xl mb-6 text-gray-800">Other News</h3>
          {sidebarNewsItems.length > 0 ? (
            sidebarNewsItems.map((item) => (
              <Link
                key={item._id}
                href={`/newsdetail/${item._id}`}
                className="flex flex-col mb-6 hover:bg-gray-200 p-3 rounded-md transition-colors duration-200"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded-md mb-3"
                    loading="lazy"
                  />
                )}
                <h4 className="font-semibold text-lg text-gray-800 mb-1">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.content}
                </p>
                <span className="text-gray-500 text-xs">
                  Published: {getRelativeTime(item.publishedAt)}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No other news available</p>
          )}
        </aside>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Your News Website. All rights reserved.
      </footer>
    </div>
  );
}