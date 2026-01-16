import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { User, Post } from "@/app/types";
import type { GenerateMetadataProps, PageParams } from "@/app/types/next"; 

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function getUser(id: string): Promise<User | null> {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getPosts(id: string): Promise<Post[]> {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata(
  props: GenerateMetadataProps
): Promise<Metadata> {
  const params = await props.params; 
  const user = await getUser(params.id);
  
  if (!user) return { title: "Kullanıcı" };
  return { title: user.name };
}

export default async function UserDetailPage(props: PageParams) {
  
  const resolvedParams = await props.params;
  const id = resolvedParams.id;

  const user = await getUser(id);
  const posts = await getPosts(id);

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Kullanıcı bulunamadı</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Kullanıcı bilgileri alınamadı.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const role = user.id % 2 === 0 ? "Admin" : "User";
  const historyItems = posts.slice(0, 3).map((post) => `Gönderi #${post.id} görüntülendi`);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <Badge variant={role === "Admin" ? "default" : "secondary"}>{role}</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{user.email}</p></div>
          <div><p className="text-xs text-muted-foreground">Telefon</p><p className="text-sm font-medium">{user.phone}</p></div>
          <div><p className="text-xs text-muted-foreground">Web</p><p className="text-sm font-medium">{user.website}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Geçmiş Hareketleri</CardTitle></CardHeader>
        <CardContent>
          {historyItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Kayıt bulunamadı.</p>
          ) : (
            <ul className="space-y-2 text-sm text-foreground">
              {historyItems.map((item, index) => (
                <li key={index} className="rounded-md border border-border px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Gönderiler ({posts.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block rounded-md border border-border px-3 py-2 text-sm transition hover:bg-muted">
              {post.title}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}