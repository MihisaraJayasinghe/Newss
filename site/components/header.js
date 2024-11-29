import React from 'react';

export default function Header() {
  // Dynamically generate the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 bg-white shadow-md border-b border-black">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left Section: Current Date */}
        <div className="text-gray-600 text-sm md:text-lg">{currentDate}</div>

        {/* Center Section: Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <a href="/" className="block">
            <h1 className="text-lg md:text-2xl font-light">NEWS WEB</h1>
          </a>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex space-x-4">
          {/* Add Button */}
          <button
            className="text-gray-700 hover:text-gray-900"
            aria-label="Add"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 12v8m-6-6h12"
              />
            </svg>
          </button>
          {/* Notifications Button */}
          <button
            className="text-gray-700 hover:text-gray-900"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}