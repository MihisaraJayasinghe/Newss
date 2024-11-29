import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav className="bg-white border-b   border-gray-200 shadow-md sticky top-16 z-50 px-4 md:px-8 py-2">
      <ul className="flex justify-center items-center flex-wrap space-y-2 md:space-y-0">
        {/* Home Icon Link */}
        <li className="flex items-center hover:text-blue-500 mx-6">
          <Link href="/" className="flex items-center">
            <FontAwesomeIcon
              icon={faHouseChimney}
              className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500"
            />
            <span className="text-xs md:text-sm font-medium">Home</span>
          </Link>
        </li>

        {/* Navigation Links */}
        <div className="flex justify-center items-center flex-wrap space-x-8 md:space-x-12">
          <li className="hover:text-blue-500">
            <Link href="/#unusum-puwath" className="scroll-smooth">
              <span className="text-xs md:text-sm">උනුසුම් පුවත්</span>
            </Link>
          </li>
          <li className="hover:text-blue-500">
            <Link href="/#pradana-puwath" className="scroll-smooth">
              <span className="text-xs md:text-sm">ප්‍රධාන පුවත්</span>
            </Link>
          </li>
          <li className="hover:text-blue-500">
            <Link href="#wigasa-puwath" className="scroll-smooth">
              <span className="text-xs md:text-sm">විගස පුවත්</span>
            </Link>
          </li>
          <li className="hover:text-blue-500 text-red-500">
            <Link href="#videos-puwaths" className="scroll-smooth">
              <span className="text-xs md:text-sm">Videos</span>
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}