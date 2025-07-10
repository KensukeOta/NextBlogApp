import type { Post } from "./Post";
import type { UserSocialProfile } from "./UserSocialProfile";
import type { Tag } from "./Tag";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  provider: string;
  bio: string;
  posts: Post[];
  liked_posts: Post[];
  user_social_profiles: UserSocialProfile[];
  tags: Tag[];
}
