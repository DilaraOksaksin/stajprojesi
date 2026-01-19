/**
 * Shared HTTP client utilities for service layer.
 * Goal: keep raw fetch + base URL here, not in pages/components.
 */

export const JSONPLACEHOLDER_BASE_URL = "https://jsonplaceholder.typicode.com";

export type NextFetchOptions = {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export type ServiceFetchInit = RequestInit & NextFetchOptions;

export async function fetchJson<T>(
  path: string,
  init?: ServiceFetchInit
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${JSONPLACEHOLDER_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}


