import api from "./axios";

// get products
export function getProducts(limit, skip) {
  return api.get("/products", {
    // for limit and skiping products
    params: {
      limit,
      skip,
    },
  });
}

// search products
export function searchProducts(query, limit, skip) {
  return api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
    },
  });
}
