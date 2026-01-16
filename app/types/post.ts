/**
 * Post domain tipleri
 */

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

// Post component props tipleri
export interface PostsPageClientProps {
  posts: Post[];
}

