function Searchbar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  setPage,
}) {
  return (
    <div className="mb-6 bg-black rounded-lg shadow-sm p-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 rounded-lg border border-gray-700 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
      </div>
      {search.trim() !== "" && category !== "" && (
        <p className="text-sm text-white-600 bg-black p-2 rounded">
          Search is active. Category filter ignored.
        </p>
      )}
    </div>
  );
}

export default Searchbar;
