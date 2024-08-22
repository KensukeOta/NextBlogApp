import type { Like } from "./Like";
import type { Post } from "./Post";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  posts: Post[];
  likes: Like[];
}