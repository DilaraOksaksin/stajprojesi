/**
 * Next.js App Router tipleri
 * 
 */

import type { ReactNode } from "react";

/**
 * Dynamic route params için page component props tipi
 */
export interface PageParams {
  params: Promise<{ id: string }>;
}

/**
 * Layout component props tipi
 * Tüm layout component'leri için standart tip
 */
export interface LayoutProps {
  children: ReactNode;
}

/**
 * generateMetadata function props tipi
 */
export interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
}

