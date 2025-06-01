import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const email = credentials.email;
          const password = credentials.password;

          const res = await fetch(`${process.env.API_URL}/v1/sessions`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: {
                email,
                password,
                provider: "credentials",
              },
            }),
          });
          if (!res.ok) {
            const errors = await res.json();
            console.log(errors);
            throw new Error();
          }
          const data = await res.json();
          user = data.user;
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
});
