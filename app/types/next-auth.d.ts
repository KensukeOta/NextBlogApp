import "next-auth";

declare module "next-auth" {
  interface User {
    provider?: string | null;
    accessToken?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string | null;
      accessToken?: string;
    };
  }
}
