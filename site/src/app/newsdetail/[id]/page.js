'use client';

import { useState, useEffect } from 'react';
import Header from '../../../../components/header';
import Navbar from '../../../../components/navbar';
import Link from 'next/link';

export default function NewsDetail({ params }) {
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [comments, setComments] = useState([
    { id: 1, author: 'Ashan Silva', text: 'This is a placeholder comment.', time: '1h' },
    { id: 2, author: 'Nimal Perera', text: 'Great insights!', time: '2h' },
  ]);
  const [newComment, setNewComment] = useState('');
  const { id } = params;

  const fetchNewsDetail = async () => {
    try {
      const response = await fetch(`/api/news?id=${id}`);
      const data = await response.json();
      if (data.success) {
        setNewsItem(data.data);
      }
    } catch (error) {
      console.error('Error fetching news article:', error);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success && newsItem) {
        const related = data.data.filter(
          (item) =>
            item._id !== newsItem._id &&
            (item.category === newsItem.category || item.tag.some((tag) => newsItem.tag.includes(tag)))
        );
        setRelatedNews(related.slice(0, 3)); // Limit to 3 related news items
      }
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  useEffect(() => {
    if (newsItem) {
      fetchRelatedNews();
    }
  }, [newsItem]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), author: 'User', text: newComment, time: 'Just now' }]);
      setNewComment('');
    }
  };

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
      <Header />
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        {/* Main news content */}
        <article className="w-full lg:w-3/4 lg:pr-8">
          <button
            onClick={() => history.back()}
            className="text-blue-600 underline mb-4"
          >
            Go Back
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
            {newsItem.title}
          </h1>
          {newsItem.imageUrl && (
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="w-full h-64 lg:h-96 object-cover rounded-md mb-6"
              loading="lazy"
            />
          )}
          <section className="text-base lg:text-lg text-gray-700 mb-6">
            {newsItem.content}
          </section>
          <div className="text-gray-500 text-sm">
            <p>Published by: {newsItem.author}</p>
            <p>Published: {new Date(newsItem.publishedAt).toLocaleString()}</p>
          </div>
          {/* Social Share */}
          <div className="flex space-x-4 mt-6">
            <span>Share:</span>
            <a href="#" className="text-blue-500">
              Facebook
            </a>
            <a href="#" className="text-blue-400">
              Twitter
            </a>
            <a href="#" className="text-pink-500">
              Instagram
            </a>
          </div>
          {/* Post Comment Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Post New Comment</h3>
            <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post your comment..."
                className="w-full p-3 border border-gray-300 rounded"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Post Comment
              </button>
            </form>
          </div>
        </article>

        {/* Right Sidebar: Related News & Comments */}
        <aside className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-md mt-8 lg:mt-0">
          {/* Related News */}
          <h3 className="font-bold text-xl mb-4 text-gray-800">Related News</h3>
          {relatedNews.length > 0 ? (
            relatedNews.map((item) => (
              <Link
                key={item._id}
                href={`/newsdetail/${item._id}`}
                className="flex flex-col mb-4 hover:bg-gray-200 p-2 rounded-md transition-colors duration-200"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-20 object-cover rounded-md mb-2"
                    loading="lazy"
                  />
                )}
                <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-gray-500 text-xs">
                  Published: {new Date(item.publishedAt).toLocaleDateString()}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No related news available.</p>
          )}

          {/* Comments Section */}
          <div className="mt-6 bg-white p-2 h-screen">
            <h3 className="text-xl font-bold  mb-4">Comments</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=random`}
                  alt={`${comment.author}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="font-bold text-xs text-gray-800">{comment.author}</p>
                  <p className="text-xs text-gray-600">{comment.text}</p>
                  <span className="text-xs text-gray-400">{comment.time}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Your News Website. All rights reserved.
      </footer>
    </div>
  );
}