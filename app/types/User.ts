import type { Post } from "./Post";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  provider: string;
  bio: string;
  posts: Post[];
  liked_posts: Post[];
}
