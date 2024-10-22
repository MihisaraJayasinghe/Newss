'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import ReactPlayer from 'react-player';

const NewsDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get the news ID from the URL
  const [newsItem, setNewsItem] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the specific news item using the ID
      const fetchNewsDetail = async () => {
        try {
          const response = await fetch(`/api/news/${id}`);
          const data = await response.json();
          setNewsItem(data.data || null);
        } catch (error) {
          console.error('Error fetching news details:', error);
        }
      };
      fetchNewsDetail();
    }
  }, [id]);

  if (!newsItem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Header and Navbar */}
      <Header />
      <Navbar />

      {/* News Detail Layout */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
        <p className="text-gray-600 mb-4">{newsItem.content}</p>

        {newsItem.videoUrl ? (
          <ReactPlayer url={newsItem.videoUrl} playing controls width="100%" />
        ) : (
          <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-auto rounded-md" />
        )}

        <div className="mt-6">
          <p className="text-gray-500">Published at: {new Date(newsItem.publishedAt).toLocaleString()}</p>
          <p className="text-gray-500">Author: {newsItem.author}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
