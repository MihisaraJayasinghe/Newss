'use client';
import { useState, useEffect } from 'react';
 
import { useRouter } from 'next/router';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidesbars'; // Left sidebar with news items
import NewsSection from '../../components/newssecsection'; // Middle section
import ReactPlayer from 'react-player';
import dayjs from 'dayjs'; // Library to handle date operations
import Link from 'next/link';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [pinnedNewsItem, setPinnedNewsItem] = useState(null); // Track the pinned news item
  const [selectedNews, setSelectedNews] = useState(null); // Track the currently selected news
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    imageUrl: '',
    videoUrl: '',
    tag: '', // Added tag field
  });

  const handleNewsClick = (id) => {
    router.push(`/news/${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      if (response.ok) {
        const newNews = await response.json();
        setNewsItems((prevItems) => [...prevItems, newNews.data]); // Add the new news to the list
        setFormData({
          title: '',
          content: '',
          category: '',
          author: '',
          imageUrl: '',
          videoUrl: '',
          tag: '', // Reset tag
        }); // Reset form
      } else {
        console.error('Error submitting news article:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting news article:', error);
    }
  };

  useEffect(() => {
    // Fetch all news articles from the API
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNewsItems(data.data || []); // Ensure data is an array
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    // Fetch the pinned news article from the API
    const fetchPinnedNews = async () => {
      try {
        const response = await fetch('/api/news?pinned=true');
        if (response.ok) {
          const data = await response.json();
          setPinnedNewsItem(data.data || null); // Set the pinned item
        }
      } catch (error) {
        console.error('Error fetching pinned news:', error);
      }
    };

    fetchNews();
    fetchPinnedNews();
  }, []);

  // Filter the Pradana Puwath articles and separate the pinned one
  const pradanaPuwathNews = newsItems.filter((item) => item.tag.includes('Pradana Puwath'));
  const nonPinnedPradanaPuwathNews = pradanaPuwathNews.filter((item) => item.stype !== 'pinned');
  const nonsPinnedPradanaPuwathNewss = newsItems.filter((item) => item.stype !== 'pinned');

  const sidebarNewsItems = newsItems.filter((item) => item.tag.includes('Unusum Puwath'));
  const sidebarNewsItemss = newsItems.filter((item) => item.category.includes('deshiya'));
  // Function to filter news by time (less than 24 hours ago)
  const recentNewsItems = newsItems.filter((item) => {
    const oneDayAgo = dayjs().subtract(1, 'day');
    return dayjs(item.publishedAt || item.createdAt).isAfter(oneDayAgo); // Check if news is less than a day old
  });

  return (
    <div >
      {/* Header and Navbar */}
      <Header />
      <Navbar />

      {/* Page Layout with 3 sections: Sidebar, NewsSection, and RightComponent */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Left */}
        <div className='w-full lg:w-1/5'>
        <div id = 'unusum-puwath'className=" p-4 bg-gray-200 h-[1] m-5 rounded-lg">

          <a className="text-2xl font-bold">උනුසුම් පුවත් </a>
          <Sidebar newsItems={sidebarNewsItems} 
          
           onNewsClick={handleNewsClick} />
           
        </div>
     
        <div id = 'unusum-puwath'className="  p-4 bg-gray-200 h-[1] m-5 rounded-lg">
          <a className="text-2xl font-bold">deshiya පුවත් </a>
          <Sidebar newsItems={sidebarNewsItemss} 
          
           onNewsClick={handleNewsClick} />
           
        </div>
</div>

        {/* Main News Section and News Grid - Center */}
        <div className="flex-1   bg-gray-200 p-4 mt-5">
          {/* Pinned News Section */}
         
          {pinnedNewsItem && (
            <div className="mb-6 p-6 bg-white border-4  border-blue-500 rounded-lg shadow-md">
              <div id="pradana-puwath" >
                
               <Link   href={`/newsdetail/${pinnedNewsItem._id}`} passHref> 
              <h2 className="text-xl font-bold text-gray-800 mb-4">ප්‍රධාන පුවත්</h2>
              <h2 className="text-3xl font-bold mb-4">{pinnedNewsItem.title}</h2>
              <div className="flex flex-col md:flex-row gap-4">
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
                  <p className="text-gray-600">{pinnedNewsItem.content.substring(0, 200)}...</p>
 
                </div>
          
              </div>
              </Link>
               
              </div>
            </div>
          
          )}
     
 
          {/* News Grid Section for "Pradana Puwath" */}
          <div  id="pradana-puwath"  className="border-2 -scroll-mb-96 ;  border-black p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">ප්‍රධාන පුවත්</h2>
            
            <NewsSection className='h-60 overflow-scroll' newsItems={nonPinnedPradanaPuwathNews}
             
             onClick={handleNewsClick}  />
            
          </div>

          {/* News Grid Section for "Wigasa Puwath" */}
          <div  id="wigasa-puwath" className="border-2  scroll-m-40 border-black p-6 bg-white rounded-md shadow-md mt-6">
            <h2 className="text-2xl    font-bold mb-4">විගස පුවත්</h2>
            
            <NewsSection   newsItems={recentNewsItems} />
          
          </div>
          <div  id="videos-puwaths" className="border-2  scroll-m-40 border-black p-6 bg-white rounded-md shadow-md mt-6">
            <h2 className="text-2xl    font-bold mb-4">videos පුවත්</h2>
            
            <ul>
              {newsItems.map((news) => (
                news.videoUrl && (
                  <li key={news._id} className=" flex inline-flex mb-4 p-5">
                    <div className="w-full md:w-1/2"> 
                    <ReactPlayer url={news.videoUrl} controls width="100%" height="auto"   />
                   </div>
                    <h4 className="font-semibold p-5  ">{news.title}</h4>
                  </li>
                )
              ))}
            </ul>
          </div>

          {/* Add News Form */}
           
        </div>

        {/* Right Sidebar */}
        <div className='w-1/5' >
          <div className="   bg-gray-100 p-4 h-[1500px] ml-5  over mb-5 rounded-md    overflow-auto mt-5"> 
        <h3 className="font-bold text-lg mb-4">Other News</h3>

{nonsPinnedPradanaPuwathNewss.length > 0 ? (
  nonsPinnedPradanaPuwathNewss.map((item, index) => (
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



     
      <a href={item.link || '#'} className="text-blue-500 text-sm">
        Read more
      </a>
    </div>
    </Link>
  ))
) : (
  <p className="text-gray-600">No other news available</p>
)}

</div>
<div className="   bg-gray-100 p-4 h-[1500px] ml-5   mb-5 rounded-md    overflow-auto mt-5"> 
<div> 
  <h1>wideshiya news</h1>
{nonsPinnedPradanaPuwathNewss.length > 0 ? (
  nonsPinnedPradanaPuwathNewss.map((item, index) => (
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



     
      <a href={item.link || '#'} className="text-blue-500 text-sm">
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
 
      </div>
    </div>
  );
}