import type { Message } from "./Message";

export interface Messages {
  partner: {
    id: string;
    name: string;
    image: string;
  };
  messages: Message[];
}
