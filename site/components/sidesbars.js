import Link from "next/link";


export default function Sidebar({ newsItems }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="text-center text-gray-500">No news available.</p>;
  }

  return (
    <div className="space-y-4">
       
      {newsItems.slice(0, 5).map((item, index) => (
        <Link key={index} href={`/newsdetail/${item._id}`} passHref>
        
        <div key={index} className="mt-10 ">
          <h3 className="text-md   mt-10  font-semibold hover:text-blue-500">
              <a href={item.link || '#'}>{item.title}</a>
            </h3>
            <div className="flex">
          {/* News Image */}
          {item.imageUrl && (
            
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-24  mt-2  h-24 object-cover  -md"
            />
          )}

          {/* News Content */}
          <div className="flex-1 text-j ml-5 mr-5">
            {/* <h3 className="text-md font-semibold hover:text-blue-500">
              <a href={item.link || '#'}>{item.title}</a>
            </h3> */}
            <p className="text-gray-600 text-justify text-sm mt-2">
              {item.content.substring(0, 50)}... {/* Trim content for preview */}
            </p>
            <p className="text-blue-500 mt-2 text-xs">{item.timestamp || 'Just now'}</p>
          </div>
          </div>
        </div>
        </Link>
      ))}
       
    </div>
  );
}
