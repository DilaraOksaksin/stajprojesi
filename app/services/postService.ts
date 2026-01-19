import type { Comment, Post } from "@/app/types";
import { fetchJson, type ServiceFetchInit } from "./http";

export async function getPosts(init?: ServiceFetchInit): Promise<Post[]> {
  try {
    return await fetchJson<Post[]>("/posts", init);
  } catch {
    return [];
  }
}

export async function getPostById(
  id: string | number,
  init?: ServiceFetchInit
): Promise<Post> {
  // For detail pages we want failures to propagate.
  return fetchJson<Post>(`/posts/${id}`, init);
}

export async function getPostsByUserId(
  userId: string | number,
  init?: ServiceFetchInit
): Promise<Post[]> {
  try {
    return await fetchJson<Post[]>(`/posts?userId=${encodeURIComponent(String(userId))}`, init);
  } catch {
    return [];
  }
}

export async function getPostsByIds(
  ids: Array<string | number>,
  init?: ServiceFetchInit
): Promise<Post[]> {
  if (!ids.length) return [];
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        return await getPostById(id, init);
      } catch {
        return null;
      }
    })
  );
  return results.filter((p): p is Post => p !== null);
}

export async function getCommentsByPostId(
  postId: string | number,
  init?: ServiceFetchInit
): Promise<Comment[]> {
  // For detail pages we want failures to propagate.
  return fetchJson<Comment[]>(`/posts/${postId}/comments`, init);
}


