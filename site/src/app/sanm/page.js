'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import Link from 'next/link';

const NewsCard = ({ news }) => (
  <Link href={`/newsdetail/${news._id}`} passHref>
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      {news.imageUrl ? (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-32 object-cover"
        />
      ) : news.videoUrl ? (
        <ReactPlayer
          url={news.videoUrl}
          width="100%"
          height="128px"
          light
          playIcon={<div></div>}
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Media</span>
        </div>
      )}
      <div className="p-2">
        <h2 className="text-sm font-semibold mb-1">{news.title}</h2>
        <span className="text-xs text-gray-500">
          {dayjs(news.createdAt).fromNow()}
        </span>
      </div>
    </div>
  </Link>
);

const NewsGrid = ({ newsItems }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {newsItems.map((news) => (
      <NewsCard key={news._id} news={news} />
    ))}
  </div>
);

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItems, setPinnedNewsItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          setPinnedNewsItems(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching pinned news:', error);
      }
    };

    fetchNews();
    fetchPinnedNews();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredNews = (tag) =>
    newsItems.filter(
      (item) => item.tag.includes(tag) && item.stype !== 'pinned'
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      <Navbar />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 w-full bg-white flex justify-between items-center p-4 z-50 shadow-md">
        <h1 className="text-lg font-bold">News Portal</h1>
        <button
          onClick={toggleSidebar}
          className="text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-2xl focus:outline-none hover:text-gray-500"
          aria-label="Close Menu"
        >
          ✕
        </button>
        <nav className="mt-16 px-4 space-y-6">
          <ul className="space-y-4">
            <li>
              <a
                href="#pradana-puwath"
                className="text-base font-medium hover:text-blue-500"
                onClick={toggleSidebar}
              >
                ප්‍රධාන පුවත්
              </a>
            </li>
            <li>
              <a
                href="#unusum-puwath"
                className="text-base font-medium hover:text-blue-500"
                onClick={toggleSidebar}
              >
                උණුසුම් පුවත්
              </a>
            </li>
            <li>
              <a
                href="#wigasa-puwath"
                className="text-base font-medium hover:text-blue-500"
                onClick={toggleSidebar}
              >
                විගස පුවත්
              </a>
            </li>
            <li>
              <a
                href="#deshiya-puwath"
                className="text-base font-medium hover:text-blue-500"
                onClick={toggleSidebar}
              >
                දේශීය පුවත්
              </a>
            </li>
            <li>
              <a
                href="#krida-puwath"
                className="text-base font-medium hover:text-blue-500"
                onClick={toggleSidebar}
              >
                ක්‍රීඩා පුවත්
              </a>
            </li>
            <li>
              <a
                href="#antara-puwath"
                className="text-base font-medium hover:text-blue-500"
                onClick={toggleSidebar}
              >
                අන්තර්ජාතික පුවත්
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-grow mt-16 lg:mt-5 px-4 lg:px-20">
        {/* Pinned News Section */}
        {pinnedNewsItems.length > 0 && (
          <section className="mb-8">
            <Link href={`/newsdetail/${pinnedNewsItems[0]._id}`} passHref>
              <div className="relative bg-white rounded-lg overflow-hidden shadow-md cursor-pointer mb-4">
                {pinnedNewsItems[0].mediaPreference === 'video' &&
                pinnedNewsItems[0].videoUrl ? (
                  <ReactPlayer
                    url={pinnedNewsItems[0].videoUrl}
                    playing
                    controls
                    width="100%"
                    height="400px"
                  />
                ) : (
                  <img
                    src={pinnedNewsItems[0].imageUrl}
                    alt={pinnedNewsItems[0].title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
                  <h2 className="text-2xl text-white font-bold">
                    {pinnedNewsItems[0].title}
                  </h2>
                </div>
              </div>
            </Link>
            {pinnedNewsItems.length > 1 && (
              <NewsGrid newsItems={pinnedNewsItems.slice(1)} />
            )}
          </section>
        )}

        {/* News Sections */}
        <section id="pradana-puwath" className="mb-8">
          <h2 className="text-xl font-bold mb-4">ප්‍රධාන පුවත්</h2>
          <NewsGrid newsItems={filteredNews('Pradana Puwath')} />
        </section>

        <section id="unusum-puwath" className="mb-8">
          <h2 className="text-xl font-bold mb-4">උණුසුම් පුවත්</h2>
          <NewsGrid newsItems={filteredNews('Unusum Puwath')} />
        </section>

        <section id="wigasa-puwath" className="mb-8">
          <h2 className="text-xl font-bold mb-4">විගස පුවත්</h2>
          <NewsGrid newsItems={filteredNews('Wigasa Puwath')} />
        </section>

        <section id="deshiya-puwath" className="mb-8">
          <h2 className="text-xl font-bold mb-4">දේශීය පුවත්</h2>
          <NewsGrid newsItems={filteredNews('Deshiya Puwath')} />
        </section>

        <section id="krida-puwath" className="mb-8">
          <h2 className="text-xl font-bold mb-4">ක්‍රීඩා පුවත්</h2>
          <NewsGrid newsItems={filteredNews('Krida Puwath')} />
        </section>

        <section id="antara-puwath" className="mb-8">
          <h2 className="text-xl font-bold mb-4">අන්තර්ජාතික පුවත්</h2>
          <NewsGrid newsItems={filteredNews('Antara Puwath')} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white p-4 text-center shadow-inner">
        &copy; {new Date().getFullYear()} Your News Website. All rights reserved.
      </footer>
    </div>
  );
}
