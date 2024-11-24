'use client';

import Link from "next/link";
import { useState } from "react";
import dayjs from 'dayjs'; // Import Day.js
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

export default function NewsSection({ newsItems, onPin }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="text-center text-gray-500">No news available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {newsItems.map((item, index) => (
        <NewsCard key={index} item={item} />
      ))}
    </div>
  );
}

function NewsCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Format the published date to relative time
  const formattedDate = item.publishedAt
    ? dayjs(item.publishedAt).fromNow()
    : "Date not available";

  return (
    <div
      className={`bg-white p-3 rounded-lg shadow-md flex flex-col transition-transform duration-300 hover:shadow-xl ${
        isExpanded ? "transform scale-105" : ""
      }`}
    >
      <Link href={`/newsdetail/${item._id}`} className="flex flex-col flex-grow">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover rounded-md mb-4"
            loading="lazy" // Add lazy loading for better performance
          />
        )}

        <div className="flex flex-col flex-grow">
          <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
          <p
            className={`text-gray-600 mt-3 text-sm ${
              isExpanded ? "block" : "line-clamp-3"
            }`}
          >
            {item.content}
          </p>
        </div>
      </Link>
      <div className="mt-2">
        {/* Display the relative published date */}
        <p className="text-gray-500 text-xs">Published: {formattedDate}</p>
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevents Link navigation on button click
            toggleExpand();
          }}
          className="text-blue-500 mt-2 text-xs underline focus:outline-none"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse content" : "Expand content"}
        >
           
        </button>
      </div>
    </div>
  );
}