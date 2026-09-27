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
import ProductForm from "@/components/dashboard/ProductForm";
import { Suspense } from "react";
import Searchbar from "@/components/dashboard/Searchbar";
import ProductsTable from "@/components/dashboard/ProductTable";
import ProductCard from "@/components/dashboard/ProductCards";
import ProductCards from "@/components/dashboard/ProductCards";
import { Button } from "@/components/ui/button";
import PaginationControls from "@/components/dashboard/Pagination";
import Rows from "@/components/dashboard/RowsDropdown";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // handle invalid "limit" value in url
  const allowedPageSizes = [10, 20, 50];
  const urlLimit = Number(searchParams.get("limit"));
  const initialLimit = allowedPageSizes.includes(urlLimit) ? urlLimit : 10;

  const [products, setProducts] = useState([]);
  const [productLimit, setproductLimit] = useState(initialLimit);
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

  function getPaginationRange() {
    const range = 2;
    let start = Math.max(1, page - range);
    let end = Math.min(totalPages, page + range);

    if (end - start < 4) {
      if (start === 1) end = Math.min(5, totalPages);
      else start = Math.max(1, end - 4);
    }

    const pages = [];
    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);

    return pages;
  }

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
        currentProducts.map((currentProduct) =>
          currentProduct.id === editingProduct.id
            ? { ...currentProduct, ...response.data }
            : currentProduct,
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

  // handling unvalid url ?page=999
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // effect to maintain url state
  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set("page", page);
    }

    if (productLimit !== 10) {
      params.set("limit", productLimit);
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
  }, [page, productLimit, search, category, sort, router]);

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
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

  // debouncing and stale search
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      loadProducts(controller.signal);
    }, 1000);

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
      setEnd(Math.min(page * productLimit, data.total));
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
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          Dashboard
        </h1>

        <div className="flex gap-3">
          {/* Add Product */}
          <Button
            variant="default"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
          >
            Add Product
          </Button>

          {/* Logout */}
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <ProductForm
        product={editingProduct}
        categories={categories}
        onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        loading={saving}
        open={showForm}
      />

      {/* search bar */}
      <Searchbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
        setPage={setPage}
      />

      <div className="flex justify-end mb-2 px-2 items-center">
        {/* rows limit */}
        <p className="px-2">Rows</p>
        <Rows
          productLimit={productLimit}
          setproductLimit={setproductLimit}
          setPage={setPage}
        />
        {/* size of products being displayed */}
        <p>
          Showing {start} - {end} of {total}
        </p>
      </div>

      {/* loading */}
      {loading && <p className="my-6 text-center">Loading products...</p>}
      {/* retry */}
      {error && !loading && (
        <div className="my-6 text-center">
          <p className="mb-3 text-red-600">{error}</p>

          <button
            onClick={handleRetry}
            className="rounded border px-4 py-2 bg-black hover:bg-gray-700 cursor-pointer"
          >
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
        <>
          <ProductsTable
            products={products}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onDelete={handleDeleteProduct}
            router={router}
          />

          {/* mobile cards */}
          <ProductCards
            products={products}
            router={router}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onDelete={handleDeleteProduct}
          />
        </>
      )}
      {/* dropdown to handle records limit  */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {/* Pagination */}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <HomeContent />
    </Suspense>
  );
}
