import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
  
  type Post = {
    id: number
    title: string
    body: string
  }
  
  type Comment = {
    id: number
    name: string
    email: string
    body: string
  }
  
  async function getPost(id: string): Promise<Post> {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      { cache: "no-store" }
    )
    return res.json()
  }
  
  async function getComments(id: string): Promise<Comment[]> {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
      { cache: "no-store" }
    )
    return res.json()
  }

  export async function generateMetadata({
    params,
  }: {
    params: { id: string }
  }): Promise<Metadata> {
    try {
      const post = await getPost(params.id)
      return { title: post?.title ?? "Gönderi" }
    } catch {
      return { title: "Gönderi" }
    }
  }
  
  export default async function PostDetailPage({
    params,
  }: {
    params: { id: string }
  }) {
    const post = await getPost(params.id)
    const comments = await getComments(params.id)
  
    return (
      <div className="p-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{post.body}</p>
          </CardContent>
        </Card>
  
        <div>
          <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>
  
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {comment.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {comment.body}
                  </p>
                  <p className="text-xs mt-2 text-gray-400">
                    {comment.email}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
