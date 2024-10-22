'use client';

import { useState, useEffect } from 'react';
 
import Header from '../../../../components/header'; // Adjust the path as needed
import Navbar from '../../../../components/navbar'; // Adjust the path as needed

export default function NewsDetail({params}) {
 
  const [newsItem, setNewsItem] = useState(null);
  const { id } = params; // Get the dynamic ID from the params

  // Fetch the news article details using the `id` from the URL
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

  if (!newsItem) {
    return <p>Loading news details...</p>; // Display loading state while fetching data
  }

  return (
    <div>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
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
    </div>
  );
}
