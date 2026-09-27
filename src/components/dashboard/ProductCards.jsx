function ProductCards({ products, router, onEdit, onDelete }) {
  return (
    <div className="space-y-4 md:hidden">
      {products.map((product) => (
        <div key={product.id} className="rounded-lg border p-4 shadow-sm">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="mb-3 h-40 w-full object-contain"
          />

          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="text-left text-lg font-bold text-blue-600"
          >
            {product.title}
          </button>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Grid for product details */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-bold text-green-600">${product.price}</p>
            </div>
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="font-medium">⭐ {product.rating}</p>
            </div>
            <div>
              <p className="text-gray-500">Stock</p>
              <p
                className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {product.stock > 0 ? `${product.stock} left` : "Out"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 rounded border border-blue-500 text-blue-600 px-3 py-2 font-medium"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 rounded border border-red-500 text-red-600 px-3 py-2 font-medium"
            >
              Delete
            </button>
          </div>

          {/* View Details button */}
          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="mt-3 w-full rounded bg-blue-600 text-white px-3 py-2 font-medium"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductCards;
