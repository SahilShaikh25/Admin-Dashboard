"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/services/productApi";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // check token before displaying product data
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  // dispaly loading buffer
  if (loading) {
    return <p className="text-center  p-90 text-3xl ">Loading...</p>;
  }

  // handling error and not found
  if (error || !product) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Product Not Found</h1>

        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded border px-4 py-2"
        >
          Back to Products
        </button>
      </main>
    );
  }

  return (
    <main className="p-8">
      <button
        onClick={() => router.push("/")}
        className="mb-6 rounded border px-4 py-2"
      >
        ← Back
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full max-w-md"
          />
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <p className="mt-2 text-gray-600">{product.description}</p>

          <p className="mt-4 text-2xl font-bold">${product.price}</p>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Brand:</strong> {product.brand || "N/A"}
          </p>

          <p>
            <strong>Rating:</strong> {product.rating}
          </p>

          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          <h2 className="mt-8 text-xl font-bold">Reviews</h2>

          {product.reviews?.length > 0 ? (
            <div className="mt-4 space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="rounded border p-4">
                  <p className="font-semibold">{review.reviewerName}</p>

                  <p className="text-sm">Rating: {review.rating}/5</p>

                  <p className="mt-2">{review.comment}</p>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </main>
  );
}
