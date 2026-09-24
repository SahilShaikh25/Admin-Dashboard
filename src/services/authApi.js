import api from "./axios";

export function login(username, password) {
  return api.post("/auth/login", {
    username,
    password,
  });
}
