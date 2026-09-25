import { useEffect, useState } from "react";

export default function ProductForm({ product, onSave, onCancel, loading }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setDescription(product.description || "");
    } else {
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
    }

    setError("");
  }, [product]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
    }

    setError("");

    onSave({
      title: title.trim(),
      price: Number(price),
      category: category.trim(),
      description: description.trim(),
    });
  }

  return (
    <div>
      <h2>{product ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block">Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Price</label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Category</label>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Description</label>

          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
            rows="4"
          />
        </div>

        {error ? <p className="text-red-600">{error}</p> : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading
              ? "saving ..."
              : product
                ? "Update Product"
                : "Add Product"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
