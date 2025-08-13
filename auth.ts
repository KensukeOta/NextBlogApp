import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

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
          user.accessToken = registeredUser.accessToken;
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // signIn後のuser情報をJWTに詰める
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.provider = account?.provider;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      // セッションにユーザー情報を追加
      if (token) {
        // id: stringまたはnumberのみにセット
        if (typeof token.id === "string" && token.id.length > 0) {
          session.user.id = token.id;
        } else if (typeof token.id === "number") {
          session.user.id = token.id.toString();
        } else {
          session.user.id = ""; // またはnull
        }

        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";

        // image: string型かつ空でない場合のみセット
        session.user.image =
          typeof token.image === "string" && token.image.length > 0 ? token.image : null;

        // provider: string型かつ空でない場合のみセット
        session.user.provider =
          typeof token.provider === "string" && token.provider.length > 0 ? token.provider : "";

        session.user.accessToken =
          typeof token.accessToken === "string" && token.accessToken.length > 0
            ? token.accessToken
            : "";
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
