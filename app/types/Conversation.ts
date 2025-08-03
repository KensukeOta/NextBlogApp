export interface Conversation {
  partner: {
    id: string;
    name: string;
    image: string;
  };
  last_message: {
    id: string;
    from_user_id: string;
    to_user_id: string;
    content: string;
    read: boolean;
    created_at: string;
  };
  unread_count: number;
}
