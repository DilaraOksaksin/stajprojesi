"use client"

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "../lib/useLocalStorage";

type Props = {
  postId: number;
};

export default function LikeButton({ postId }: Props) {
  const [liked, setLiked] = useLocalStorage<boolean>(
    `post-like-${postId}`,
    false
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLiked(!liked)}
    >
      <Heart
        className={`h-5 w-5 transition ${
          liked
            ? "fill-red-500 text-red-500"
            : "text-gray-400"
        }`}
      />
    </Button>
  );
}
