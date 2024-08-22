import type { Post } from "./Post";

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  post: Post;
}