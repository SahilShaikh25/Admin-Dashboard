export default function ProductsTable({ products, onEdit, onDelete, router }) {
  return (
    <div className="hidden md:block bg-black rounded-lg shadow-md overflow-hidden">
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
            <tr
              key={product.id}
              className={`border-t hover:bg-blue-200 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <td className="p-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  width="50"
                  className="rounded-lg shadow-sm"
                />
              </td>
              <td className="p-4">
                <button
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition"
                >
                  {product.title}
                </button>
              </td>
              <td className="p-4 text-sm text-gray-600 line-clamp-1">
                {product.description}
              </td>
              <td className="p-4 text-sm">{product.category}</td>
              <td className="p-4 font-bold text-green-600">${product.price}</td>
              <td className="p-4 text-center">⭐ {product.rating}</td>
              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {product.stock > 0 ? `${product.stock}` : "Out"}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg border border-blue-500 bg-white text-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="rounded-lg border border-red-500 bg-white text-red-600 px-3 py-1.5 text-sm font-medium hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
