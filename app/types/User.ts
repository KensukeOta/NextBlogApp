import type { Like } from "./Like";
import type { Post } from "./Post";
import type { Tag } from "./Tag";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  posts: Post[];
  likes: Like[];
  tags: Tag[];
  followings: User[];
  followers: User[];
}