import FollowButton from "./follow-button";
import { User } from "../../../types/user";

type PageProps = {
  params: { id: string };
};

export default async function UserDetailPage({ params }: PageProps) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${params.id}`,
    { cache: "no-store" }
  );

  const user: User = await res.json();

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-3xl font-semibold">{user.name}</h1>
      <p>Email: {user.email}</p>
      <FollowButton />
    </div>
  );
}
