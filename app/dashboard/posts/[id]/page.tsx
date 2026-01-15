import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { Metadata } from "next";

import { Post, Comment } from "@/types";


async function getPost(id: string): Promise<Post> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { next: { revalidate: 3600 } } 
  );
  if (!res.ok) throw new Error("Gönderi bulunamadı");
  return res.json();
}

async function getComments(id: string): Promise<Comment[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Yorumlar yüklenemedi");
  return res.json();
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>; 
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(id);
    return { title: post?.title ?? "Gönderi Detayı" };
  } catch {
    return { title: "Gönderi Detayı" };
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params; 
  
  const [post, comments] = await Promise.all([getPost(id), getComments(id)]);

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-4xl mx-auto">
      <Card className="border-none shadow-md bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-lg">{post.body}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <h2 className="text-xl font-bold">Yorumlar</h2>
          <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
            {comments.length}
          </span>
        </div>

        <div className="grid gap-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="border-border/50 hover:bg-accent/5 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  {comment.name}
                  <span className="text-[10px] text-muted-foreground font-normal italic">
                    {comment.email}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{comment.body}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}