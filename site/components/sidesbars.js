import Link from "next/link";
import dayjs from "dayjs";

export default function Sidebar({ newsItems }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="text-center text-gray-500">No news available.</p>;
  }

  const now = dayjs();

  const getTimeDisplay = (timestamp) => {
    const publishedTime = dayjs(timestamp);
    if (!publishedTime.isValid()) {
      console.warn("Invalid date:", timestamp);
      return "Unknown time";
    }

    const diffInMinutes = now.diff(publishedTime, "minute");
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${now.diff(publishedTime, "hour")} hours ago`;
    return publishedTime.format("MMM D, YYYY h:mm A");
  };

  return (
    <div className="space-y-4">
      {newsItems.slice(0, 5).map((item) => (
        <Link key={item._id} href={`/newsdetail/${item._id}`} passHref>
          <div className="cursor-pointer">
            {/* LIVE Badge */}
            {item.live === "live" && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                LIVE
              </span>
            )}
            <h3 className="text-sm font-semibold hover:text-blue-500 mt-2">
              <a href={item.link || "#"}>{item.title}</a>
            </h3>
            <div className="flex mt-2">
              {/* News Image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-32 h-24 object-cover rounded-md"
                />
              )}
              {/* News Content */}
              <div className="flex-1 ml-5 ">
                <p className="text-gray-600 mr-5  ml-2 text-justify text-xs">
                  {item.content.substring(0, 80)}...
                </p>
                <p className="text-blue-500 text-xs text-right mt-2 mr-5">
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
