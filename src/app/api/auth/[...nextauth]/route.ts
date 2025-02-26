import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { ConnectDB, getMongoClient } from '../../../../../lib/db';
import { NextRequest } from 'next/server';


const dbPromise = ConnectDB();

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
    ],
    adapter: MongoDBAdapter(await getMongoClient()), 
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as const, 
    },
    callbacks: {
        async jwt({ token, account, user }: { token: any; account?: any; user?: any }) {
            if (account) {
                token.accessToken = account.access_token; 
                token.provider = account.provider;
            }
            if (user) {
                token.id = user.id || user._id?.toString();
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
            }
            return token;
        },

        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.accessToken = token.accessToken;
                session.user.provider = token.provider;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };