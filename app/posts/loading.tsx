import { Card } from "../../component/ui/card";

export default function PostsLoading() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-semibold">Posts</h1>

      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="h-24 animate-pulse bg-gray-100"
        />
      ))}
    </div>
  );
}
