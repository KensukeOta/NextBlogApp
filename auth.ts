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

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      const name = user.name;
      const email = user.email;
      const image = user.image;
      const provider = account?.provider;

      try {
        const res = await fetch(`${process.env.API_URL}/v1/oauth`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              name,
              email,
              provider,
              image,
            },
          }),
        });
        if (!res.ok) {
          const errors = await res.json();
          throw new Error(errors);
        } else {
          // APIサーバー側から正しいユーザーデータを受け取る
          const data = await res.json();
          const registeredUser = data.user;

          // セッションのuser情報をここで上書きして返す
          user.name = registeredUser.name;
          user.email = registeredUser.email;
          user.image = registeredUser.image;
          user.id = registeredUser.id;
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});
