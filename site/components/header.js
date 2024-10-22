export default function Header() {
    return (
      <header className="flex h-40  border-b-1 border-black border-solid justify-center justify-items-center sticky top-0  mt-auto mb-automl-auto mr-auto bg-white stroke-slate-50 p-4">
         
        <div className="text-center justify-center w-screen ">
          <h1 className="text-4xl mt-10 text-center font-light">NEWS WEB</h1>
          <p className=" absolute l-0 top-5 text-xl mt-10">October 11, 2024</p>
         
        </div>
        <div className=" sm:hi absolute  right-0  ">
          {/* <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-3 py-2"
          /> */}
          <button className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v8m-6-6h12" />
            </svg>
          </button>
          <button className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v8m-6-6h12" />
            </svg>
          </button>
        </div>
      </header>
    );
  }
  