'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidesbars';
import NewsSection from '../../components/newssecsection';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

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

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

  const nonPinnedPradanaPuwathNews = newsItems.filter(
    (item) => item.tag.includes('Pradana Puwath') && item.stype !== 'pinned'
  );

  const oneDayAgo = dayjs().subtract(1, 'day');
  const recentWigasaPuwathNews = newsItems.filter((item) =>
    dayjs(item.createdAt).isAfter(oneDayAgo)
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <Navbar />

      {/* Mobile Hamburger Menus */}
      <div className="lg:hidden flex justify-between p-4 bg-gray-200">
        <button onClick={toggleLeftSidebar} className="text-xl font-bold">
          ☰ Unusum & Deshiya Puwath
        </button>
        <button onClick={toggleRightSidebar} className="text-xl font-bold">
          ☰ Other News
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow mt-5">
        {/* Left Sidebar */}
        <div
          className={`lg:w-1/5 ${
            isLeftSidebarOpen ? 'block' : 'hidden lg:block'
          } bg-gray-200 flex flex-col h-full ml-2 mr-2 mt-2 lg:ml-5 lg:mr-5 lg:mt-5`}
        >
          <div className="p-4 bg-gray-200 flex-1 ml-2 mr-2 lg:ml-5 lg:mr-5 rounded-lg overflow-auto max-h-[2000px]">
            <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">Unusum Puwath</h2>
            <Sidebar newsItems={newsItems.filter(item => item.tag.includes('Unusum Puwath'))} />
          </div>
          <div className="p-4 bg-gray-200 flex-1 m-2 ml-2 lg:m-5 lg:ml-5 rounded-lg overflow-auto max-h-[2000px]">
            <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">Deshiya Puwath</h2>
            <Sidebar newsItems={newsItems.filter(item => item.category.includes('deshiya'))} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-200 p-2 lg:p-4 mt-2 lg:mt-5 flex flex-col justify-end">
          {/* Pinned News Section */}
          {pinnedNewsItem && (
            <div className="mb-4 lg:mb-6 p-4 lg:p-6 bg-white border-4 border-blue-500 rounded-lg shadow-md max-h-[300px] lg:max-h-[400px] overflow-auto m-2 lg:m-5">
              <Link href={`/newsdetail/${pinnedNewsItem._id}`} passHref>
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-4">ප්‍රධාන පුවත්</h2>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-4">{pinnedNewsItem.title}</h2>
                  <div className="flex flex-col md:flex-row gap-2 lg:gap-4">
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
                      <p className="text-gray-600 text-sm lg:text-base">
                        {pinnedNewsItem.content.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Pradana Puwath Section */}
          <div
            id="pradana-puwath"
            className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md max-h-[300px] lg:max-h-[400px] overflow-auto m-2 lg:m-5"
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">ප්‍රධාන පුවත්</h2>
            <NewsSection newsItems={nonPinnedPradanaPuwathNews} />
          </div>

          {/* Wigasa Puwath Section */}
          {recentWigasaPuwathNews.length > 0 && (
            <div
              id="wigasa-puwath"
              className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md max-h-[300px] lg:max-h-[400px] overflow-auto m-2 lg:m-5"
            >
              <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">විගස පුවත්</h2>
              <NewsSection newsItems={recentWigasaPuwathNews} />
            </div>
          )}

          {/* All News Section */}
          <div
            id="all-news"
            className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md max-h-[300px] lg:max-h-[400px] overflow-auto m-2 lg:m-5"
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">All News</h2>
            <NewsSection newsItems={newsItems} />
          </div>

          {/* Videos Section */}
          <div
            id="videos-puwaths"
            className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md max-h-[300px] lg:max-h-[400px] overflow-auto m-2 lg:m-5"
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">videos පුවත්</h2>
            <ul>
              {newsItems.map(
                (news) =>
                  news.videoUrl && (
                    <li key={news._id} className="flex flex-col md:flex-row mb-2 lg:mb-4 p-2 lg:p-5">
                      <div className="w-full md:w-1/2 mb-2 md:mb-0">
                        <ReactPlayer url={news.videoUrl} controls width="100%" height="auto" />
                      </div>
                      <h4 className="font-semibold p-2 lg:p-5 text-sm lg:text-base">{news.title}</h4>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`lg:w-1/5 ${
            isRightSidebarOpen ? 'block' : 'hidden lg:block'
          } mt-2 lg:mt-5`}
        >
          <div className="bg-gray-100 p-2 lg:p-4 ml-2 mr-2 lg:ml-5 lg:mr-5 rounded-md overflow-auto max-h-[2100px]">
            <h3 className="font-bold text-lg lg:text-xl mb-2 lg:mb-4">Other News</h3>
            {newsItems.filter(item => item.stype !== 'pinned').map((item, index) => (
              <Link key={index} href={`/newsdetail/${item._id}`} passHref>
                <div className="mb-2 lg:mb-4 cursor-pointer hover:bg-gray-200 p-2 lg:p-4 rounded">
                  <h4 className="font-semibold text-xs lg:text-sm mb-1 lg:mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-xs lg:text-sm">
                    {item.content.substring(0, 100)}...
                  </p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-16 lg:h-24 object-cover rounded-md mb-1 lg:mb-2"
                    />
                  )}
                  <a href={item.link || '#'} className="text-blue-500 text-xs lg:text-sm">
                    Read more
                  </a>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
