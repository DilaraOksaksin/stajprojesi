"use client";

import { useState } from "react";

export default function FollowButton() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <button
      onClick={() => setIsFollowing(!isFollowing)}
      className={`px-4 py-2 rounded text-white ${
        isFollowing ? "bg-green-600" : "bg-blue-600"
      }`}
    >
      {isFollowing ? "Takip Ediliyor" : "Takip Et"}
    </button>
  );
}
