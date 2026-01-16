import PostsPageClient from "./posts-page-client";
import { Post } from "@/app/types"

export const metadata = {
  title: "Gönderiler",
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  return res.json();
}

export default async function DashboardPostsPage() {
  const posts = await getPosts();
  return <PostsPageClient posts={posts} />;
}
