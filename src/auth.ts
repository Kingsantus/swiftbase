import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as v from "valibot";
import { LoginSchema } from "@/validators/login-validators";
// import { DrizzleAdapter } from "@auth/drizzle-adapter"
// import { db } from "./db/index";
import { findUserByEmail } from "./resources/user-queries";
import argon2 from "argon2"; 

// export const { 
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut 
// } = NextAuth({
//   adapter: DrizzleAdapter(db),
//   providers: [],
// })

const nextAuth = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login"},
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(LoginSchema, credentials);

        if (parsedCredentials.success){
          const { email, password } = parsedCredentials.output;

          const user = await findUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await argon2.verify(user.password, password);

          if (passwordsMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          };
        }

        return null;
      }
    })
  ]
})


export const { signIn, auth, signOut, handlers } = nextAuth;