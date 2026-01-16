/**
 * User domain tipleri
 */

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

// User filtreleme ve sıralama tipleri
export type RoleFilter = "all" | "admin" | "user";
export type StatusFilter = "all" | "aktif" | "pasif";
export type SortOption =
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc";

// User component props tipleri
export interface UsersPageClientProps {
  users: User[];
}
