import api from "./axios";

// get products
export function getProducts(limit, skip, sortBy, order) {
  return api.get("/products", {
    // for limit and skiping products
    params: {
      limit,
      skip,
      sortBy,
      order,
    },
  });
}

// search products
export function searchProducts(query, limit, skip, sortBy, order) {
  return api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
      sortBy,
      order,
    },
  });
}

export function getCategories() {
  return api.get("/products/categories");
}

export function getProductsByCategory(category, limit, skip, sortBy, order) {
  return api.get(`/products/category/${category}`, {
    params: {
      limit,
      skip,
      sortBy,
      order,
    },
  });
}
