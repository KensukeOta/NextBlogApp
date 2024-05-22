import type { User } from "./User";

export interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  user: User
}