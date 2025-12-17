"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { User } from "../types/user"

type Props = {
  users: User[]
  initialSearch: string
}

export default function UserSearch({ users, initialSearch }: Props) {
  const [search, setSearch] = useState(initialSearch)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)

    if (value) {
      router.push(`/users?search=${value}`)
    } else {
      router.push("/users")
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes((search ?? "").toLowerCase())
  )
  
  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Kullanıcı ara..."
        className="border p-2 rounded mb-4 w-full max-w-sm"
      />

      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li key={user.id} className="border p-2 rounded">
            {user.name}
          </li>
        ))}
      </ul>

      {filteredUsers.length === 0 && (
        <p className="text-muted-foreground">
          Sonuç bulunamadı.
        </p>
      )}
    </div>
  )
}
