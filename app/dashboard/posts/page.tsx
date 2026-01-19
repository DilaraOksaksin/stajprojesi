import PostsPageClient from "./posts-page-client";
import type { Post } from "@/app/types";
import { getPosts as getPostsService } from "@/app/services/postService";

export const metadata = {
  title: "Gönderiler",
};

export default async function DashboardPostsPage() {
  const posts: Post[] = await getPostsService({ cache: "no-store" });
  return <PostsPageClient posts={posts} />;
}
