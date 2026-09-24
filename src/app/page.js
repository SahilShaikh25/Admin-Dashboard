"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productApi";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await getProducts();
    console.log(response);
    setProducts(response.data.products);
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
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
    </main>
  );
}
