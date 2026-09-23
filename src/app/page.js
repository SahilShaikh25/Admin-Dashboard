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

    setProducts(response.data.products);
  }

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => (
        <p key={product.id}>
          {product.title} - ${product.price}
        </p>
      ))}
    </div>
  );
}
