import { type DefaultSession, JWT as DefaultJWT } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      tenantId: string;
      provider: string;
      providerId: string;
      accountType: string;
      mspId: string?;
      endCustomerId: string?;
      consentGiven: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    tenantId: string & DefaultSession["user"];
  }

  export interface JWT {
    audience: string;
    provider: string;
    providerId: string;
    accountType: string;
    mspId: string?;
    endCustomerId: string?;
  }

  interface Profile {
    aud?: string;
    tid?: string;
  }
}
