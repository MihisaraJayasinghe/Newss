import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-2 border-black sticky top-14 border-solid text-xs h-20 md:text-md xl:text-sm font-bold py-2">
      <ul className="flex md:w-2/3 w-full xl:w-2/3 xl:text-lg justify-around ml-auto mr-auto mt-5">
        {/* Home Icon Link */}
        <li className="hover:text-blue-500 flex items-center">
          <Link href="/" className="scroll-smooth flex items-center">
            {/* Home Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0l-2-2m-4 2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V12a2 2 0 00-2-2h-4"
              />
            </svg>
            {/* Optional: Home Text */}
         
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
