import UserSearch from "../../component/user-search";
import { User } from "../../types/user";

  export default async function UsersPage() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      cache: "no-store",
    });
   
    const users: User[] = await res.json();
   
    return (
      <div className="p-10">
        <h1 className="text-3xl font-semibold mb-4">Kullanıcılar</h1>
        <UserSearch users={users} />
      </div>
    );
  }
   