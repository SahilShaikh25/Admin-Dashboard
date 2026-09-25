"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productApi";
import { useRouter, useSearchParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [productLimit, setproductLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / productLimit);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);

  // used for check invalid page req ?page=abc
  const urlPage = Number(searchParams.get("page"));
  const initialPage = Number.isInteger(urlPage) && urlPage >= 1 ? urlPage : 1;
  const [page, setPage] = useState(initialPage);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleRetry() {
    loadProducts();
  }

  // delete function
  async function handleDeleteProduct(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (error) {
      alert("Failed to delete product");
    }
  }

  // update function
  async function handleUpdateProduct(product) {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const response = await updateProduct(editingProduct.id, product);

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === editingProduct.id ? response.data : item,
        ),
      );

      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  // add function
  async function handleAddProduct(product) {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const response = await addProduct(product);

      setProducts((currentProducts) => [response.data, ...currentProducts]);
      setShowForm(false);
    } catch (error) {
      alert("failed to add product");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set("page", page);
    }

    if (search.trim() !== "") {
      params.set("search", search);
    }

    if (category !== "") {
      params.set("category", category);
    }

    if (sort !== "") {
      params.set("sort", sort);
    }

    const queryString = params.toString();

    router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
  }, [page, search, category, sort, router]);

  //  restricting unauth users from accessing dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // load categories
  useEffect(() => {
    async function loadCategories() {
      const response = await getCategories();
      setCategories(response.data);
    }
    loadCategories();
  }, []);

  // debouncing and stale search
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      loadProducts(controller.signal);
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [page, productLimit, search, category, sort]); // we want to reload when user changes page or record's size

  // main function that fetches data in dashboard
  async function loadProducts(signal) {
    const skip = (page - 1) * productLimit; // (2 - 1) * 10 = 10 record skip therefore we get page 2

    setLoading(true);
    setError("");

    try {
      let response;

      //when searched a product
      if (search.trim() !== "") {
        response = await searchProducts(
          search,
          productLimit,
          skip,
          sort,
          sort ? "asc" : undefined,
          signal,
        );
        // category is changed
      } else if (category !== "") {
        response = await getProductsByCategory(
          category,
          productLimit,
          skip,
          sort,
          sort ? "asc" : undefined,
          signal,
        );
      } else {
        // default (no search)
        response = await getProducts(
          productLimit,
          skip,
          sort,
          sort ? "asc" : undefined,
          signal,
        );
      }

      const data = response.data;
      setProducts(data.products);
      setTotal(data.total);

      setStart(data.total === 0 ? 0 : (page - 1) * productLimit + 1);
      setEnd(Math.min(page * productLimit, total));
    } catch (error) {
      if (error.name === "CanceledError") {
        return;
      }

      setProducts([]);
      setTotal(0);
      setStart(0);
      setEnd(0);
      setError("Failed to load products");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="rounded bg-black px-4 py-2 text-white border"
          >
            Add Product
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="rounded border px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          loading={saving}
        />
      )}
      {/* search bar */}
      <div className="flex gap-2 ">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className=" my-5 rounded border p-2 w-100"
        />
        {/* category button */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className=" bg-[rgb(11_10_9)]"
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        {/* sort button */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="bg-[rgb(11_10_9)]"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
      </div>
      {/* size of products being displayed */}
      <div className="flex justify-end mb-2 px-2">
        <p>
          showing {start} - {end} of {total}
        </p>
      </div>
      {/* loading */}
      {loading && <p className="my-6 text-center">Loading products...</p>}
      {/* retry */}
      {error && !loading && (
        <div className="my-6 text-center">
          <p className="mb-3 text-red-600">{error}</p>

          <button onClick={handleRetry} className="rounded border px-4 py-2">
            Retry
          </button>
        </div>
      )}
      {/* checking for empty list */}
      {!loading && !error && products.length === 0 && (
        <p className="my-6 text-center">No products found.</p>
      )}
      {/* porduct table */}
      {!loading && !error && products.length > 0 && (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-3 text-left">Image</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Description</th>
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3 text-left">Price</th>
              <th className="border p-3">Actions</th>
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
                <td className="border p-3">
                  <button
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="font-semibold underline"
                  >
                    {product.title}
                  </button>
                </td>
                <td className="border p-3">{product.description}</td>
                <td className="border p-3">{product.category}</td>
                <td className="border p-3">{product.price}</td>
                <td className="border p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="rounded border px-3 py-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded border px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <select
          value={productLimit}
          onChange={(e) => {
            setproductLimit(Number(e.target.value));
            setPage(1);
          }}
          className="mr-2 rounded border p-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`rounded border px-3 py-2 ${
                pageNumber === page ? "font-bold underline" : ""
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
