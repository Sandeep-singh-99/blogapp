import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add 'id' to user type
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Ensure User type has 'id'
  }
}
