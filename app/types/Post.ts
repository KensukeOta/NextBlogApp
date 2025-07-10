import type { User } from "./User";
import type { Like } from "./Like";
import type { Tag } from "./Tag";

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  user: User;
  likes: Like[];
  tags: Tag[];
}
