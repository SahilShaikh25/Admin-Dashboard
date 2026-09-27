export default function Rows({ productLimit, setproductLimit, setPage }) {
  return (
    <div>
      <select
        value={productLimit}
        onChange={(e) => {
          setproductLimit(Number(e.target.value));
          setPage(1);
        }}
        className="bg-white mr-2 rounded border p-2 cursor-pointer"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}
