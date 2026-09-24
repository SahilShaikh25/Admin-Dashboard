"use client";

import { useEffect, useState } from "react";
import { getProducts, searchProducts } from "@/services/productApi";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [productLimit, setproductLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, productLimit, search]); // we want to reload when user changes page or record's size

  async function loadProducts() {
    const skip = (page - 1) * productLimit; // (2 - 1) * 10 = 10 record skip therefore we get page 2
    let response;

    if (search.trim() === "") {
      response = await getProducts(productLimit, skip);
    } else {
      response = await searchProducts(search, productLimit, skip);
    }

    setProducts(response.data.products); // products data
    const total = response.data.total;
    setTotal(total); //total number of products
    setStart((page - 1) * productLimit + 1);
    setEnd(Math.min(page * productLimit, total));
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-center">Dashboard</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-4 rounded border p-2 w-100"
      />
      <div>
        <p>
          showing {start} - {end} of {total}
        </p>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-3 text-left">Image</th>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Description</th>
            <th className="border p-3 text-left">Category</th>
            <th className="border p-3 text-left">Price</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className="border p-3">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  width="60"
                ></img>
              </td>
              <td className="border p-3">{product.title}</td>
              <td className="border p-3">{product.description}</td>
              <td className="border p-3">{product.category}</td>
              <td className="border p-3">{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-4 mt-4 justify-end">
        // product limit
        <select
          value={productLimit}
          onChange={(e) => {
            setproductLimit(Number(e.target.value));
            setPage(1);
          }}
          className="rounded border p-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page | {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * productLimit >= total}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
