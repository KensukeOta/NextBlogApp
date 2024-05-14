import type { Provider } from "next-auth/providers";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const providers: Provider[] = [
  Google,
  GitHub,
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) { // サインイン時にユーザーが利用可能
        token.id = user.id; // トークンにidを追加
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string; // セッションにidを追加
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});