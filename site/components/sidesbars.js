import Link from "next/link";
import dayjs from "dayjs";

export default function Sidebar({ newsItems }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="text-center text-gray-500">No news available.</p>;
  }

  const getTimeDisplay = (timestamp) => {
    const publishedTime = dayjs(timestamp);
    const now = dayjs();

    if (!publishedTime.isValid()) {
      console.warn("Invalid date:", timestamp);
      return "Unknown time";
    }

    const diffInMinutes = now.diff(publishedTime, "minute");

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      const diffInHours = now.diff(publishedTime, "hour");
      return `${diffInHours} hours ago`;
    } else {
      return publishedTime.format("MMM D, YYYY h:mm A"); // Display formatted date for older news
    }
  };

  return (
    <div className="space-y-4">
      {newsItems.slice(0, 5).map((item, index) => (
        <Link key={index} href={`/newsdetail/${item._id}`} passHref>
          {item.live === 'live' && (
              <span className="  bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                LIVE
              </span>
            )}
          <div className="mt-10">
            <h3 className="text-sm font-semibold hover:text-blue-500">
              <a href={item.link || '#'}>{item.title}</a>
              
            </h3>
            <div className="flex">
              {/* News Image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-32 h-24 mt-2 object-cover rounded-md"
                />
              )}

              {/* News Content */}
              <div className="flex-1 ml-5 mr-5">
                <p className="text-gray-600 text-justify text-xs mt-2">
                  {item.content.substring(0, 50)}... {/* Trim content for preview */}
                </p>
                <p className="text-blue-500 mt-2 text-xs">
                  {getTimeDisplay(item.publishedAt)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
