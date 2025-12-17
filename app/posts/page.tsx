import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card"
import Link from "next/link"

type Post = {
  id: number
  title: string
  body: string
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-semibold">Posts</h1>

      {posts.slice(0, 10).map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>
              <Link href={`/posts/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              {post.body}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
