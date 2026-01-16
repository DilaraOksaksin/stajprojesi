/**
 * Component props tipleri
 * 
 */

import type { User } from "./user";

/**
 * UsersGrid component props
 */
export interface UsersGridProps {
  users: User[];
}

/*
 * FavoriButonu component props
 */
export interface FavoriButonuProps {
  id: number;
  className?: string;
}

