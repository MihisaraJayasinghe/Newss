import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav className="bg-white border-2 border-black sticky top-14 border-solid text-xs h-20 md:text-md xl:text-sm font-bold py-2">
      <ul className="flex md:w-2/3 w-full xl:w-2/3 xl:text-lg justify-around ml-auto mr-auto mt-5">
        
        {/* Home Icon Link */}
        <li className="hover:text-blue-500 flex items-center">
          <Link href="/" className="scroll-smooth flex items-center">
            <FontAwesomeIcon icon={faHouseChimney} className="w-6 h-6 mr-2 text-blue-500" />
            <span className="ml-1">Home</span>
          </Link>
        </li>

        {/* Existing Navigation Links */}
        <li className="hover:text-blue-500">
          <Link href="/#unusum-puwath" className="scroll-smooth">
            උනුසුම් පුවත්
          </Link>
        </li>
        <li className="hover:text-blue-500">
          <Link href="/#pradana-puwath" className="scroll-smooth">
            ප්‍රධාන පුවත්
          </Link>
        </li>
        <li className="hover:text-blue-500">
          <Link href="#wigasa-puwath" className="scroll-smooth">
            විගස පුවත්
          </Link>
        </li>
        <li className="hover:text-blue-500 text-red-500">
          <Link href="#videos-puwaths" className="scroll-smooth">
            Videos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
