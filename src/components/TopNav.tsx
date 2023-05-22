
function TopNav() {
  return (
    <nav id="top__nav" className="border-b border-gray-200 w-full">
      <label className="relative text-gray-400 focus-within:text-gray-600 block mx-4">
        <span className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-7 material-symbols-rounded">
          search
        </span>
        <input
          type="text"
          name="fileSearch"
          id="fileSearch"
          placeholder="Search here"
          className="bg-gray-50 placeholder-gray-400 text-sm rounded-full p-2 px-12 m-3"
        />
      </label>
    </nav>
  );
}

export default TopNav;
