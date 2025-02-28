import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getMongoClient } from "./db"; 

export async function getAuthOptions(): Promise<NextAuthOptions> {
  const client = await getMongoClient(); 

  return {
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
          token.id = user.id || (user as any)._id?.toString();
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
        }
        return token;
      },

      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.id;
          (session.user as any).accessToken = token.accessToken;
          (session.user as any).provider = token.provider;
        }
        return session;
      },
    },
  };
}
