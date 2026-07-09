"use client";

import { getApiUrl } from "./api";

const TOKEN_KEY = "nk_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(extra = {}) {
  const token = getToken();
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export async function adminLogin(password) {
  const res = await fetch(`${getApiUrl()}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  setToken(data.token);
  return data;
}

export async function verifyToken() {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${getApiUrl()}/admin/me`, { headers: authHeaders() });
    return res.ok;
  } catch {
    return false;
  }
}

// Generic JSON request with auth
async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${getApiUrl()}${path}`, {
    method,
    headers: authHeaders(body ? { "Content-Type": "application/json" } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Products
export const listProducts = () => request("/products");
export const getProductById = (id) => request(`/products/id/${id}`);
export const createProduct = (body) => request("/products", { method: "POST", body });
export const updateProduct = (id, body) => request(`/products/${id}`, { method: "PUT", body });
export const deleteProduct = (id) => request(`/products/${id}`, { method: "DELETE" });

// Collections
export const listCollections = () => request("/collections");
export const createCollection = (body) => request("/collections", { method: "POST", body });
export const updateCollection = (id, body) =>
  request(`/collections/${id}`, { method: "PUT", body });
export const deleteCollection = (id) => request(`/collections/${id}`, { method: "DELETE" });

// Image upload (multipart)
export async function uploadImages(files) {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("images", f));
  const res = await fetch(`${getApiUrl()}/images`, {
    method: "POST",
    headers: authHeaders(), // no content-type; browser sets multipart boundary
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.urls;
}
