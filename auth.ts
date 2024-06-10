import type { Provider } from "next-auth/providers";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

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
      if (user) {
        token.email = user.email
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const res = await fetch(`${process.env.API_URL}/v1/api/users/email/${token.email}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        session.user.id = data.id;
      } catch (error) {
        console.log(error);
      }
      return session
    },
    async signIn({ user, account }) {
      const uid = account?.providerAccountId;
      const name = user.name;
      const email = user.email;
      const image = user.image;
      const provider = account?.provider;

      try {
        const res = await fetch(`${process.env.API_URL}/v1/api/auth/${provider}/callback`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, name, email, image }),
        });
        if (!res.ok) {
          const errors = await res.json();
          throw new Error(errors.message);
        } else {
          return true
        }
      } catch (error) {
        console.log(error);
        return false
      }
    }
  },
  pages: {
    signIn: "/login",
  },
});