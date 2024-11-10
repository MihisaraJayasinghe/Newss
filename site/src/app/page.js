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
const NewsSectionWithToggle = ({ title, newsItems, limit = 6   }) => {
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
    <div className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md max-h-full overflow-auto m-2 lg:m-5">
      <h2 className="text-base lg:text-sm font-bold mb-2 lg:mb-4">{title}</h2>
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
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
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

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

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

      {/* Mobile Hamburger Menus */}
      <div className="lg:hidden flex justify-between p-4 bg-gray-200">
        <button onClick={toggleLeftSidebar} className="text-base font-bold">
          ☰ Unusum & Deshiya Puwath
        </button>
        <button onClick={toggleRightSidebar} className="text-base font-bold">
          ☰ Other News
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow mt-5">
        {/* Left Sidebar */}
        <div
          className={`lg:w-1/5 ${
            isLeftSidebarOpen ? 'block' : 'hidden lg:block'
          } flex flex-col h-full ml-2 mr-2 mt-2 lg:ml-5 lg:mr-5 rounded-lg lg:mt-5`}
        >
          {/* Unusum Puwath Section */}
          <div id='unusum-puwath' className="p-4  bg-gray-100   flex-1 mb-4 rounded-lg overflow-auto max-h-[2000px]">
            <h2  className="text-sm lg:text-lg p0 underline font-bold mb-2 lg:mb-4">
              උනුසුම් පුවත්
            </h2>
            <Sidebar
              newsItems={newsItems.filter((item) =>
                item.tag.includes('Unusum Puwath')
               
              )}

             
            />

          {newsItems.live === 'live' && (
        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          LIVE
        </span>
      )}
          </div>

          {/* Deshiya Puwath Section */}
          <div className="p-4 mt-10 bg-gray-100 flex-1 mb-4 rounded-lg overflow-auto max-h-[2000px]">
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
          <div className="p-4 bg-gray-100 flex-1 rounded-lg overflow-auto max-h-[2000px]">
            <h2 className="text-sm lg:text-xs font-bold mb-2 lg:mb-4">
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
        <div className="flex-1 bg-gray-50  lg:mt-5 flex flex-col rounded-lg">
          {/* Pinned News Section */}
          
          {pinnedNewsItem && (
            <div id='pradana-puwath' className="mb-4  scorll-m-40 lg:mb-6 p-4 lg:pl-6 lg:pr-6 bg-white border-4 border-blue-500 rounded-lg shadow-md max-h-[400px] overflow-auto   ml-5 mr-5">
              <Link href={`/newsdetail/${pinnedNewsItem._id}`} passHref>
                <div className="cursor-pointer">
               
                  <h2 className="text-xs lg:text-xl font-bold text-gray-800 mb-2 lg:mb-4">
                    ප්‍රධාන පුවත්
                  </h2>
                  {pinnedNewsItem.live === 'live' && (
        <span className="  bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          LIVE
        </span>
      )}
                  <h2 className="text-sm lg:text-xl font-bold mb-2 lg:mb-4">
                    {pinnedNewsItem.title}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-2 lg:gap-4">
                    {pinnedNewsItem.videoUrl &&
                    pinnedNewsItem.mediaPreference === 'video' ? (
                      <div className="w-60 rounded-lg overflow-hidden  ">
                        <ReactPlayer

                          url={pinnedNewsItem.videoUrl}
                          playing
                          controls
                          width="100%"
                          height="auto"
                          className="rounded-lg" 
                        />
                      </div>
                    ) : pinnedNewsItem.imageUrl ? (
                      <img
                        src={pinnedNewsItem.imageUrl}
                        alt={pinnedNewsItem.title}
                        className="w-full md:w-1/2 object-cover rounded-md"
                      />
                    ) : (
                      <p className="text-xs">No media available</p>
                    )}
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs lg:text-lg">
                        {pinnedNewsItem.content.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Pradana Puwath Section with "See More" */}
          <NewsSectionWithToggle
           className="fixed"
            title="ප්‍රධාන පුවත්"
            titleClassName="text-xl"
            newsItems={nonPinnedPradanaPuwathNews}
           
            limit={6}
            
          />

          {/* Wigasa Puwath Section with "See More" */}
          <div id='wigasa-puwath' className=' scroll-m-32 '>
          { recentWigasaPuwathNews.length > 0 && (
            < NewsSectionWithToggle
           
              title="විගස පුවත්"
              titleClassName="text-xl"
          
              newsItems={recentWigasaPuwathNews}
              limit={6}
            />
          )}
          </div>

          {/* All News Section with "See More" */}
          <NewsSectionWithToggle title="All News" newsItems={newsItems} limit={9} />

          {/* Videos Section with "See More" */}
          <div className="border-2 border-black p-4 lg:p-6 bg-white rounded-md shadow-md max-h-full overflow-auto m-2 lg:m-5">
            <h2 className="text-base lg:text-sm font-bold mb-2 lg:mb-4">
              Videos පුවත්
            </h2>
            <ul>
              {newsItems.slice(0, 6).map(
                (news) =>
                  news.videoUrl && (
                    <li
                      key={news._id}
                      className="flex flex-col  mb-2   p-2 lg:p-5"
                    >
                      <div className="w-full   mb-2  ">
                        <ReactPlayer
                          url={news.videoUrl}
                          controls
                          width="100%"
                          height="auto"
                        />
                      </div>
                      <h4 className="font-semibold p-2 lg:p-5 text-xs lg:text-xs">
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

        {/* Right Sidebar */}
        <div
          className={`lg:w-1/5 ${
            isRightSidebarOpen ? 'block' : 'hidden lg:block'
          } mt-2 lg:mt-5`}
        >
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[2100px] ml-2 mr-2 lg:ml-5 lg:mr-5">
            <h3 className="font-bold text-sm lg:text-lg mb-2 lg:mb-4">
              වෙනත් පුවත්
            </h3>
            {newsItems
              .filter((item) => item.stype !== 'pinned')
              .slice(0, visibleRightSidebarCount)
              .map((item, index) => (
                <Link key={index} href={`/newsdetail/${item._id}`} passHref>
                  <div className="mb-2 lg:mb-4 cursor-pointer hover:bg-gray-200 p-2 lg:p-4 rounded">
                    <h4 className="font-semibold text-xs lg:text-xs mb-2">
                      {item.title}
                    </h4>
                    <div className="flex flex-col lg:flex-row gap-2">
                      {item.imageUrl && (
                        <div className="w-full  h-20">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full lg:h-20 object-cover rounded-md mb-2 lg:mb-0"
                          />
                        </div>
                      )}
                      <div className="w-full lg:w-2/3">
                        <p className="text-gray-600 text-xs text-justify">
                          {item.content.substring(0,50)}...
                        </p>
                        <a
                          href={item.link || '#'}
                          className="text-blue-500 text-xs lg:text-sm"
                        >
                          Read more
                        </a>
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
                className="mt-2 lg:mt-4 text-blue-500 text-xs lg:text-sm underline"
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
