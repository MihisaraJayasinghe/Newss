'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import Navbar from '../../../components/navbar';
import Sidebar from '../../../components/sidesbars';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data.data || []);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchPinnedNews = async () => {
      try {
        const response = await fetch('/api/news?pinned=true');
        if (response.ok) {
          const data = await response.json();
          setPinnedNewsItem(data.data || null);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching pinned news:', error);
        setError(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">Sorry, there was an error loading the news. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col  bg-gray-100 transition-colors duration-500">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navbar />

      {/* Mobile Hamburger Menus */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <button
          onClick={toggleLeftSidebar}
          className="text-2xl font-semibold text-gray-700 focus:outline-none"
          aria-label="Toggle Left Sidebar"
        >
          ☰ මෙනු
        </button>
        <button
          onClick={toggleRightSidebar}
          className="text-2xl font-semibold text-gray-700 focus:outline-none"
          aria-label="Toggle Right Sidebar"
        >
          ☰ වැඩි
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow mt-5 px-4 lg:px-8">
        {/* Left Sidebar */}
        <aside
          className={`lg:w-1/5 w-full ${
            isLeftSidebarOpen ? 'block' : 'hidden lg:block'
          } bg-white shadow-lg rounded-lg p-6 mb-4 lg:mb-0 transition-all duration-300`}
        >
          {/* Sidebar Sections */}
          {/* Unusum Puwath Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">උනස්සම් පුවත්</h2>
            <Sidebar newsItems={newsItems.filter(item => item.tag.includes('Unusum Puwath'))} />
          </div>

          {/* Deshiya Puwath Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">දේශීය පුවත්</h2>
            <Sidebar newsItems={newsItems.filter(item => item.category.includes('deshiya'))} />
          </div>

          {/* Krida Puwath Section */}
          <div>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">ක්‍රීඩා පුවත්</h2>
            <Sidebar newsItems={newsItems.filter(item => item.tag.includes('Krida Puwath'))} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-6">
          {/* Pinned News Section */}
          {pinnedNewsItem && (
            <section className="mb-12 bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <Link href={`/newsdetail/${pinnedNewsItem._id}`} className="block">
                <div className="relative">
                  {pinnedNewsItem.videoUrl ? (
                    <div className="w-full h-80 sm:h-96">
                      <ReactPlayer
                        url={pinnedNewsItem.videoUrl}
                        controls
                        width="100%"
                        height="100%"
                        className="object-cover"
                      />
                    </div>
                  ) : pinnedNewsItem.imageUrl ? (
                    <img
                      src={pinnedNewsItem.imageUrl}
                      alt={pinnedNewsItem.title}
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Media Available</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">ප්‍රධාන පුවත්</h2>
                  <h3 className="text-4xl font-semibold text-gray-800 mb-4">{pinnedNewsItem.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {pinnedNewsItem.content.substring(0, 200)}...
                  </p>
                </div>
              </Link>
            </section>
          )}

          {/* Pradana Puwath Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-blue-600">ප්‍රධාන පුවත්</h2>
              <Link href="/pradana-puwath" className="text-blue-500 hover:underline text-sm">
                සියල්ල බලන්න
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonPinnedPradanaPuwathNews.map((news) => (
                <div
                  key={news._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:scale-105"
                >
                  <Link href={`/newsdetail/${news._id}`} className="block">
                    <div className="relative">
                      {news.videoUrl ? (
                        <div className="w-full h-48 sm:h-56">
                          <ReactPlayer
                            url={news.videoUrl}
                            controls
                            width="100%"
                            height="100%"
                            className="object-cover"
                          />
                        </div>
                      ) : news.imageUrl ? (
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-48 sm:h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Media Available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {news.content.substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Krida Puwath Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-red-600">ක්‍රීඩා පුවත්</h2>
              <Link href="/krida-puwath" className="text-red-500 hover:underline text-sm">
                සියල්ල බලන්න
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonPinnedKridaPuwathNews.map((news) => (
                <div
                  key={news._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:scale-105"
                >
                  <Link href={`/newsdetail/${news._id}`} className="block">
                    <div className="relative">
                      {news.videoUrl ? (
                        <div className="w-full h-48 sm:h-56">
                          <ReactPlayer
                            url={news.videoUrl}
                            controls
                            width="100%"
                            height="100%"
                            className="object-cover"
                          />
                        </div>
                      ) : news.imageUrl ? (
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-48 sm:h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Media Available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {news.content.substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Wigasa Puwath Section */}
          {recentWigasaPuwathNews.length > 0 && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-green-600">විගස පුවත්</h2>
                <Link href="/wigasa-puwath" className="text-green-500 hover:underline text-sm">
                  සියල්ල බලන්න
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentWigasaPuwathNews.map((news) => (
                  <div
                    key={news._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:scale-105"
                  >
                    <Link href={`/newsdetail/${news._id}`} className="block">
                      <div className="relative">
                        {news.videoUrl ? (
                          <div className="w-full h-48 sm:h-56">
                            <ReactPlayer
                              url={news.videoUrl}
                              controls
                              width="100%"
                              height="100%"
                              className="object-cover"
                            />
                          </div>
                        ) : news.imageUrl ? (
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-48 sm:h-56 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Media Available</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {news.content.substring(0, 100)}...
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All News Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">සියලුම පුවත්</h2>
              <Link href="/all-news" className="text-gray-500 hover:underline text-sm">
                සියල්ල බලන්න
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((news) => (
                <div
                  key={news._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:scale-105"
                >
                  <Link href={`/newsdetail/${news._id}`} className="block">
                    <div className="relative">
                      {news.videoUrl ? (
                        <div className="w-full h-48 sm:h-56">
                          <ReactPlayer
                            url={news.videoUrl}
                            controls
                            width="100%"
                            height="100%"
                            className="object-cover"
                          />
                        </div>
                      ) : news.imageUrl ? (
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-48 sm:h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Media Available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {news.content.substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Videos Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-purple-600">Videos පුවත්</h2>
              <Link href="/videos-puwaths" className="text-purple-500 hover:underline text-sm">
                සියල්ල බලන්න
              </Link>
            </div>
            <ul className="space-y-8">
              {newsItems.map(
                (news) =>
                  news.videoUrl && (
                    <li
                      key={news._id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:scale-105"
                    >
                      <Link href={`/newsdetail/${news._id}`} className="block">
                        <div className="relative">
                          <div className="w-full h-64 sm:h-80">
                            <ReactPlayer
                              url={news.videoUrl}
                              controls
                              width="100%"
                              height="100%"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="text-2xl font-semibold text-gray-800">{news.title}</h4>
                        </div>
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside
          className={`lg:w-1/5 w-full ${
            isRightSidebarOpen ? 'block' : 'hidden lg:block'
          } bg-white shadow-lg rounded-lg p-6 mb-4 lg:mb-0 transition-all duration-300`}
        >
          <h3 className="text-2xl font-semibold text-indigo-600 mb-6">වෙනත් පුවත්</h3>
          <ul className="space-y-6">
            {newsItems.filter(item => item.stype !== 'pinned').map((item, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 hover:bg-gray-100 rounded-lg p-4 transition-colors duration-300"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div>
                  <Link href={`/newsdetail/${item._id}`} className="block">
                    <h4 className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {item.content.substring(0, 100)}...
                    </p>
                  </Link>
                  <Link href={item.link || '#'} className="text-blue-500 text-sm hover:underline">
                    Read more
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
