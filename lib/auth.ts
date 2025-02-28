import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getMongoClient } from "./db"; 

const client = await getMongoClient(); 
export const  getAuthOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
    ],
    adapter: MongoDBAdapter(client),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, account, user }) {
        if (account) {
          token.accessToken = account.access_token;
          token.provider = account.provider;
        }
        if (user) {
          token.id = user.id || (user as { _id?: { toString: () => string } })._id?.toString();
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
        }
        return token;
      },

      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.accessToken = token.accessToken as string;
          session.user.provider = token.provider as string;
        }
        return session;
      },
    },
}


