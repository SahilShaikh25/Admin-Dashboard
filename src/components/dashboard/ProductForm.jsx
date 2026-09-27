"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductForm({
  product,
  onSave,
  onCancel,
  loading,
  categories,
  open,
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setPrice(product.price || "");
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
      return;
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
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? "Saving..." : product ? "Update" : "Add"}
            </Button>
            <Button variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// import { useEffect, useState } from "react";

// export default function ProductForm({
//   product,
//   onSave,
//   onCancel,
//   loading,
//   categories,
// }) {
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (product) {
//       setTitle(product.title || "");
//       setPrice(product.price || "");
//       setCategory(product.category || "");
//       setDescription(product.description || "");
//     } else {
//       setTitle("");
//       setPrice("");
//       setCategory("");
//       setDescription("");
//     }

//     setError("");
//   }, [product]);

//   function handleSubmit(e) {
//     e.preventDefault();

//     if (!title.trim()) {
//       setError("Title is required");
//       return;
//     }

//     if (!price || Number(price) <= 0) {
//       setError("Price must be greater than 0");
//       return;
//     }

//     if (!category.trim()) {
//       setError("Category is required");
//       return;
//     }

//     if (!description.trim()) {
//       setError("Description is required");
//       return;
//     }

//     setError("");

//     onSave({
//       title: title.trim(),
//       price: Number(price),
//       category: category.trim(),
//       description: description.trim(),
//     });
//   }

//   return (
//     <div className="mb-2">
//       <h2>{product ? "Edit Product" : "Add Product"}</h2>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label className="mb-1 block">Title</label>

//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block">Price</label>

//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full rounded border p-2"
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat.slug} value={cat.slug}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="mb-1 block">Description</label>

//           <textarea
//             type="text"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full rounded border p-2"
//             rows="4"
//           />
//         </div>

//         {error ? <p className="text-red-600">{error}</p> : null}

//         <div className="flex gap-3">
//           <button
//             type="submit"
//             disabled={loading}
//             className="rounded bg-black px-4 py-1 text-white disabled:opacity-50 cursor-pointer hover:bg-gray-900"
//           >
//             {loading
//               ? "saving ..."
//               : product
//                 ? "Update Product"
//                 : "Add Product"}
//           </button>

//           <button
//             type="button"
//             onClick={onCancel}
//             className="rounded px-2 py-1 bg-red-700 text-white cursor-pointer hover:bg-red-500"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
