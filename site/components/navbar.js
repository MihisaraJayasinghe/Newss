import Link from "next/link";
 
export default function Navbar() {
  return (
    <nav className="bg-white border-2 border-black sticky top-14 border-solid text-xs h-20 md:text-md xl:text-sm font-bold py-2">
      <ul className="flex md:w-2/3 sticky top-10 mt-5 w-full xl:2/3 xl:text-lg justify-around ml-auto mr-auto">
        <li className="hover:text-blue-500">
          <Link href="/#unusum-puwath" className="scroll-smooth">උනුසුම් පුවත්</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link href="/#pradana-puwath" className="scroll-smooth">ප්‍රධාන පුවත්</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link href="#wigasa-puwath" className="scroll-smooth">විගස පුවත්</Link>
        </li>
        <li className="hover:text-blue-500 text-red-500">
          <a href="#videos-puwaths" className="scroll-smooth">Videos</a>
        </li>
      </ul>
    </nav>
  );
}
