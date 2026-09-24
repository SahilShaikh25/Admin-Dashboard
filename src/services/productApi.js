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
