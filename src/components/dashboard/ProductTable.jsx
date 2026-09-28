import { useState } from "react"
import DeleteAlert from "./DeleteAlert";

export default function ProductsTable({ products, onEdit, onDelete, router }) {
  const [deleteId, setDeleteId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [showError, setShowError] = useState(false)

  const handleConfirmDelete = async () => {
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      setErrorMessage("Failed to delete product");
      setShowError(true);
      setDeleteId(null);
    }
  }

  return (
    <>
      <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Image</th>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Description</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-left font-semibold">Price</th>
              <th className="p-4 text-center font-semibold">Rating</th>
              <th className="p-4 text-center font-semibold">Stock</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={product.id} className={`border-t hover:bg-gray-200 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="p-4">
                  <img src={product.thumbnail} alt={product.title} width="50" className="rounded-lg shadow-sm" />
                </td>
                <td className="p-4">
                  <button onClick={() => router.push(`/products/${product.id}`)} className="font-semibold text-black hover:underline cursor-pointer transition">
                    {product.title}
                  </button>
                </td>
                <td className="p-4 text-sm text-black line-clamp-1">{product.description}</td>
                <td className="p-4 text-m">{product.category}</td>
                <td className="p-4 font-bold text-black">${product.price}</td>
                <td className="p-4 text-center">⭐ {product.rating}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {product.stock > 0 ? `${product.stock}` : "Out"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => onEdit(product)} className="rounded-lg border border-gray-800 bg-white text-black px-4 py-1.5 text-sm font-medium cursor-pointer">
                      Edit
                    </button>
                    <button onClick={() => setDeleteId(product.id)} className="rounded-lg border border-red-500 bg-white text-red-500 px-3 py-1.5 text-sm font-medium cursor-pointer">
                      Delete
                    </button>
                    <DeleteAlert />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteAlert
        open={deleteId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <DeleteAlert
        open={showError}
        onConfirm={() => setShowError(false)}
        onCancel={() => setShowError(false)}
        isError={true}
        errorMessage={errorMessage}
      />
    </>
  );
}