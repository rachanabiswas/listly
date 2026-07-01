import prisma from "@/lib/database/dbClient";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { serverEnv } from "@/lib/env/serverEnv";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`[AUTH] Password reset requested for ${user.email}: ${url}`);
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
