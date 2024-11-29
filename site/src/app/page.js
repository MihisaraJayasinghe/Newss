'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidesbars';
import NewsSection from '../../components/newssecsection';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import Link from 'next/link';

// Reusable component for main news sections with "See More" functionality
const NewsSectionWithToggle = ({ title, newsItems, limit = 6 }) => {
  const [visibleCount, setVisibleCount] = useState(limit);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSeeMore = () => {
    setVisibleCount(newsItems.length);
    setIsExpanded(true);
  };

  const handleSeeLess = () => {
    setVisibleCount(limit);
    setIsExpanded(false);
  };

  return (
    <div className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md m-2 lg:m-5">
      <h2 className="text-base lg:text-xl font-bold mb-2 lg:mb-4">{title}</h2>
      <NewsSection newsItems={newsItems.slice(0, visibleCount)} />
      {newsItems.length > limit && (
        <button
          onClick={isExpanded ? handleSeeLess : handleSeeMore}
          className="mt-2 lg:mt-4 text-blue-500 text-xs lg:text-sm underline"
        >
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleRightSidebarCount, setVisibleRightSidebarCount] = useState(9);
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const nonPinnedPradanaPuwathNews = newsItems.filter(
    (item) => item.tag.includes('Pradana Puwath') && item.stype !== 'pinned'
  );

  const nonPinnedKridaPuwathNews = newsItems.filter(
    (item) => item.tag.includes('Krida Puwath') && item.stype !== 'pinned'
  );

  const oneDayAgo = dayjs().subtract(1, 'day');
  const recentWigasaPuwathNews = newsItems.filter((item) =>
    dayjs(item.createdAt).isAfter(oneDayAgo)
  );

  // Handler for Right Sidebar "See More"
  const handleRightSidebarSeeMore = () => {
    setVisibleRightSidebarCount(
      newsItems.filter((item) => item.stype !== 'pinned').length
    );
    setIsRightSidebarExpanded(true);
  };

  const handleRightSidebarSeeLess = () => {
    setVisibleRightSidebarCount(9);
    setIsRightSidebarExpanded(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />

      {/* Mobile Hamburger Menu */}
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center p-4 z-50 lg:hidden">
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
  className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-transform transform ${
    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } w-64 z-50 shadow-lg`}
>
  <button
    onClick={toggleSidebar}
    className="absolute top-4 right-4 text-2xl focus:outline-none hover:text-gray-300"
    aria-label="Close Menu"
  >
    ✕
  </button>
  <div className="mt-8 px-4">
    <h1 className="text-2xl font-bold mb-6">News Portal</h1>
  </div>
  <nav className="mt-4 px-4 space-y-6">
    {/* Categories Section */}
    <h2 className="text-lg font-semibold mb-2">Categories</h2>
    <ul className="space-y-4">
      <li>
        <a
          href="#unusum-puwath"
          className="flex items-center text-base font-medium hover:text-blue-300"
          onClick={toggleSidebar}
        >
          <span className="mr-2">🔥</span>
          Unusum Puwath
        </a>
      </li>
      <li>
        <a
          href="#wigasa-puwath"
          className="flex items-center text-base font-medium hover:text-blue-300"
          onClick={toggleSidebar}
        >
          <span className="mr-2">📰</span>
          Wigasa Puwath
        </a>
      </li>
      <li>
        <a
          href="#deshiya-puwath"
          className="flex items-center text-base font-medium hover:text-blue-300"
          onClick={toggleSidebar}
        >
          <span className="mr-2">🌍</span>
          Deshiya Puwath
        </a>
      </li>
      <li>
        <a
          href="#all-news"
          className="flex items-center text-base font-medium hover:text-blue-300"
          onClick={toggleSidebar}
        >
          <span className="mr-2">📚</span>
          All News
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

      {/* Content */}
      <div className="flex flex-col lg:flex-row flex-grow mt-5 ">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:w-80 flex flex-col h-full ml-2 mr-2 mt-2 lg:ml-5 lg:mr-5 rounded-lg lg:mt-5">
          {/* Unusum Puwath Section (Desktop Only) */}
          <div
            id="unusum-puwath-sidebar"
            className="p-4 bg-gray-100 flex-1 mb-4 rounded-lg"
          >
            <h2 className="text-sm lg:text-xl underline font-bold mb-2 lg:mb-4">
              උනුසුම් පුවත්
            </h2>
            <Sidebar
              newsItems={newsItems.filter((item) =>
                item.tag.includes('Unusum Puwath')
              )}
            />
          </div>

          {/* Deshiya Puwath Section */}
          <div
            id="deshiya-puwath-sidebar"
            className="p-4 mt-10 bg-gray-100 flex-1 mb-4 rounded-lg"
          >
            <h2 className="text-sm lg:text-lg font-bold mb-2 lg:mb-4">
              දෙශිය පුවත්
            </h2>
            <Sidebar
              newsItems={newsItems.filter((item) =>
                item.category.includes('deshiya')
              )}
            />
          </div>

          {/* Krida Puwath Section */}
          <div
            id="krida-puwath-sidebar"
            className="p-4 bg-gray-100 flex-1 rounded-lg"
          >
            <h2 className="text-sm lg:text-lg font-bold mb-2 lg:mb-4">
              Krida Puwath
            </h2>
            <Sidebar
              newsItems={newsItems.filter((item) =>
                item.tag.includes('Krida Puwath')
              )}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 lg:mt-5 flex flex-col rounded-lg">
          {/* Pinned News Section */}
          {pinnedNewsItem && (
            <div
              id="pradana-puwath"
              className="mb-2 scroll-m-40  p-4 lg:pl-6 lg:pr-6 bg-gray-100 border-2 border-blue-500 rounded-lg shadow-md ml-5 mr-5"
            >
              <Link href={`/newsdetail/${pinnedNewsItem._id}`} passHref>
                <div className="cursor-pointer">
                  <h2 className="text-base lg:text-2xl font-bold text-gray-800 mb-2 lg:mb-4">
                    ප්‍රධාන පුවත් වීඩියෝව 
                  </h2>
                  {pinnedNewsItem.live === 'live' && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      LIVE
                    </span>
                  )}
                  
                  <div className="flex flex-col md:flex-row items-start gap-4">
  {/* Video Section */}
  <div className="w-full md:w-1/2">
    {pinnedNewsItem.videoUrl && pinnedNewsItem.mediaPreference === 'video' ? (
      <ReactPlayer
        url={pinnedNewsItem.videoUrl}
         
        controls
        width="100%"
        height="auto"
        className="rounded-lg"
      />
    ) : pinnedNewsItem.imageUrl ? (
      <img
        src={pinnedNewsItem.imageUrl}
        alt={pinnedNewsItem.title}
        className="w-full object-cover rounded-lg"
      />
    ) : (
      <p className="text-xs">No media available</p>
    )}
  </div>

  {/* Text Section */}
  <div className="w-full md:w-1/2 flex flex-col justify-start">
    {/* Title */}
    <h2 className="text-xs lg:text-sm   font-bold mb-2">{pinnedNewsItem.title}</h2>

    {/* Content */}
    <p className="text-gray-600 text-xs lg:text-xs mb-4">
      {pinnedNewsItem.content.substring(0, 200)}...
    </p>

    {/* Time or Date Added */}
    <span className="text-xs lg:text-sm text-blue-500">{dayjs(pinnedNewsItem.createdAt).fromNow()}</span>
  </div>
</div>


                  
                </div>
              </Link>
            </div>
          )}

          {/* Pradana Puwath Section with "See More" */}
          <div id="pradana-puwath">
            <NewsSectionWithToggle
              title="ප්‍රධාන පුවත්"
              newsItems={nonPinnedPradanaPuwathNews}
              limit={6}
            />
          </div>

          {/* Unusum Puwath Section (Mobile Only) */}
          <div
            id="unusum-puwath"
            className="block lg:hidden"
          >
            <NewsSectionWithToggle
              title="උනුසුම් පුවත්"
              newsItems={newsItems.filter((item) =>
                item.tag.includes('Unusum Puwath')
              )}
              limit={6}
            />
          </div>

          {/* Wigasa Puwath Section with "See More" */}
          <div id="wigasa-puwath" className="scroll-m-32">
            {recentWigasaPuwathNews.length > 0 && (
              <NewsSectionWithToggle
                title="විගස පුවත්"
                newsItems={recentWigasaPuwathNews}
                limit={6}
              />
            )}
          </div>

          {/* Deshiya Puwath Section */}
          <div id="deshiya-puwath" className='scroll-m-32'>
            <NewsSectionWithToggle
              title="දෙශිය පුවත්"
              newsItems={newsItems.filter((item) =>
                item.category.includes('deshiya')
              )}
              limit={6}
            />
          </div>

          {/* All News Section with "See More" */}
          <div id="all-news">
            <NewsSectionWithToggle
              title="All News"
              newsItems={newsItems}
              limit={9}
            />
          </div>

          {/* Videos Section with "See More" */}
          <div className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md m-2 lg:m-5">
            <h2 className="text-base lg:text-xl font-bold mb-2 lg:mb-4">
              Videos පුවත්
            </h2>
            <ul>
              {newsItems.slice(0, 6).map(
                (news) =>
                  news.videoUrl && (
                    <li
                      key={news._id}
                      className="flex flex-col mb-2 p-2 lg:p-5"
                    >
                      <div className="w-full mb-2 p-2 ">
                        <ReactPlayer
                          url={news.videoUrl}
                          controls
                          width="100%"
                          height="auto"
                          className="rounded-lg"
                          
                        />
                      </div>
                      <h4 className="font-semibold p-2 lg:p-5 text-xs lg:text-sm">
                        {news.title}
                      </h4>
                    </li>
                  )
              )}
            </ul>
            {newsItems.filter((item) => item.videoUrl).length > 6 && (
              <button
                onClick={() => {
                  /* Implement similar toggle functionality if needed */
                }}
                className="mt-2 lg:mt-4 text-blue-500 text-xs lg:text-sm underline"
              >
                See More
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:w-96  lg:mt-5">
          <div className="bg-gray-100 p-4 rounded-md ml-2 mr-2 lg:ml-5 lg:mr-5">
            <h3 className="font-bold text-sm lg:text-xl mb-2 lg:mb-4 ml-2">
              වෙනත් පුවත්
            </h3>
            {newsItems
              .filter((item) => item.stype !== 'pinned')
              .slice(0, visibleRightSidebarCount)
              .map((item, index) => (
                <Link
                  key={index}
                  href={`/newsdetail/${item._id}`}
                  passHref
                >
                  <div className=" lg:mb-4 cursor-pointer hover:bg-gray-200 p-2 lg:p-4 rounded">
                    <h4 className="font-semibold text-md lg:text-sm text-justify mb-2">
                      {item.title.substring(0, 50)}...
                  
                    </h4>
                    <div className="flex flex-col lg:flex-row gap-2">
                      {item.imageUrl && (
                        <div className="   ">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className=" w-32 h-24 object- rounded-md  lg:mb-0"
                            

                          />
                        </div>
                      )}
                      <div className="w-full pl-2 lg:w-2/3 ">
                        <p className="text-gray-600 text-xs text-ju stify">
                          {item.content.substring(0, 140)}...
                        </p>
                         
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            {newsItems.filter((item) => item.stype !== 'pinned').length > 9 && (
              <button
                onClick={
                  isRightSidebarExpanded
                    ? handleRightSidebarSeeLess
                    : handleRightSidebarSeeMore
                }
                className="  text-blue-500 text-xs lg:text-sm underline"
              >
                {isRightSidebarExpanded ? 'See Less' : 'See More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Your News Website. All rights reserved.
      </footer>
    </div>
  );
}