export default function Navbar() {
    return (
      <nav className="bg-white border-2 border-black border-solid text-xs h-20 md:text-md xl:text-md text-bold  font-bold py-2">
        <ul className="flex md:w-2/3 mt-5 w-full  xl:2/3 xl:text-xl justify-around ml-auto mr-auto">
         
          <li className="hover:text-blue-500"><a href="#">Unusm puwath</a></li>
          <li className="hover:text-blue-500"><a href="#">Pradana Puwath</a></li>
          <li className="hover:text-blue-500"><a href="#">Wigasa Puwath</a></li>
          <li className="text-red-500 hover:text-blue-500"><a href="#">Videos</a></li>
        </ul>
      </nav>
    );
  }
  