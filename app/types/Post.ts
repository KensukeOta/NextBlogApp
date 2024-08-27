import type { Like } from "./Like";
import type { Tag } from "./Tag";
import type { User } from "./User";

export interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  user: User;
  likes: Like[];
  tags: Tag[];
}