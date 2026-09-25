import api from "./axios";

// get products
export function getProducts(limit, skip, sortBy, order, signal) {
  return api.get("/products", {
    // for limit and skiping products
    params: {
      limit,
      skip,
      sortBy,
      order,
    },
    signal,
  });
}

// search products
export function searchProducts(query, limit, skip, sortBy, order, signal) {
  return api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
      sortBy,
      order,
    },
    signal,
  });
}

// CRUD
// get product by id
export function getProductById(id) {
  return api.get(`/products/${id}`);
}

// add
export function addProduct(product) {
  return api.post("/products/add", product);
}

// update
export function updateProduct(id, product) {
  return api.put(`/products/${id}`, product);
}

// delete
export function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

// get all categories
export function getCategories() {
  return api.get("/products/categories");
}

// get products of a single category
export function getProductsByCategory(
  category,
  limit,
  skip,
  sortBy,
  order,
  signal,
) {
  return api.get(`/products/category/${category}`, {
    params: {
      limit,
      skip,
      sortBy,
      order,
    },
    signal,
  });
}
