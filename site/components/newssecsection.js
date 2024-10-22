export default function NewsSection({ newsItems, onPin }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="text-center text-gray-500">No news available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md"
            />
          )}
          <h3 className="text-xl font-bold mt-4">
            <a href={item.link || '#'}>{item.title}</a>
          </h3>
          <p className="text-gray-600 mt-2">{item.content.substring(0, 150)}...</p>
          <p className="text-blue-500 mt-2 text-sm">{item.timestamp || 'Just now'}</p>

          {/* Pin Button */}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => onPin(item)}
          >
            Pin
          </button>
        </div>
      ))}
    </div>
  );
}
