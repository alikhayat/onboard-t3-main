import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Console } from "console";
import { Adapter } from "next-auth/adapters.js";

import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    errorFormat: "pretty",
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const getLinkedPrismaAdapter = PrismaAdapter(prisma);

const _linkAccount = getLinkedPrismaAdapter.linkAccount;
getLinkedPrismaAdapter.linkAccount = ({
  providerAccountId,
  provider,
  type,
  userId,
  access_token,
  id_token,
  expires_at,
  refresh_token,
  scope,
  session_state,
  token_type,
}) => {
  return _linkAccount({
    providerAccountId,
    provider,
    type,
    userId,
    access_token,
    id_token,
    expires_at,
    refresh_token,
    scope,
    session_state,
    token_type,
  });
};
