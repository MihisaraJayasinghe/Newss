import Link from "next/link";
import { useState } from "react";

export default function NewsSection({ newsItems, onPin }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="text-center text-gray-500">No news available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.map((item, index) => (
        <NewsCard key={index} item={item} />
      ))}
    </div>
  );
}

function NewsCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`  bg-white p-6 rounded-lg shadow-md cursor-pointer flex flex-col transition-all duration-300 ${
        isExpanded ? "h-auto" : "h-96 overflow-hidden"
      }`}
    >
      {/* Conditionally render the LIVE badge */}
      

      <Link href={`/newsdetail/${item._id}`} passHref>
        <div>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          
          <div className="flex flex-col flex-grow mt-4">
            <h3 className="text-sm font-bold">{item.title}</h3>
            <p
              className={`text-gray-600 mt-2 text-sm ${
                isExpanded ? "" : "line-clamp-4"
              }`}
            >
              {item.content}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-auto">
        <p className="text-blue-500 mt-2 text-sm">{item.timestamp || "Just now"}</p>
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevents Link navigation on button click
            toggleExpand();
          }}
          className="text-blue-500 mt-2 text-sm"
        >
          {isExpanded ? "See Less" : "See More"}
        </button>
      </div>
    </div>
  );
}
