import axios from "axios";
import NextAuth, { User, type NextAuthOptions } from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
// Prisma adapter for NextAuth, optional and can be removed

import { env } from "../../../env/server.mjs";
import { getLinkedPrismaAdapter } from "../../../server/db/client";
import {
  AzureOrganization,
  AzureOrganizationResponse,
} from "../../../types/azure/azure-organization";
import { prisma } from "../../../server/db/client";
import { Customer, Domain, Msp, Tenant } from "@prisma/client";
const getOrganization = async (
  accessToken: string
): Promise<AzureOrganization | null> => {
  const organizations = await axios.get<AzureOrganizationResponse>(
    "https://graph.microsoft.com/v1.0/organization?$select=displayName,id,city,street,countryLetterCode,street,state,tenantType,verifiedDomains,postalCode",
    {
      headers: { authorization: `Bearer ${accessToken}` },
    }
  );
  if (organizations.data.value.length != 1) {
    throw new Error("User is part of more than one organization"); // Might need to resolve this in the future
  }
  return organizations?.data?.value?.at(0) || null;
};

const createTenant = async (
  azureOrganization: AzureOrganization
): Promise<Tenant> => {
  const domains: Partial<Domain>[] = azureOrganization.verifiedDomains.map(
    (domain) => {
      return {
        fqdn: domain.name,
        isDefault: domain.isDefault,
        isInitial: domain.isInitial,
      };
    }
  );
  const tenant = await prisma?.tenant.create({
    data: {
      accountType: "MSP",
      azureTenantId: azureOrganization.id,
      name: azureOrganization.displayName,
      domains: { create: domains as Domain[] },
    },
  });

  if (!tenant) {
    throw new Error("Tenant was not created");
  }

  return tenant;
};

const ensureTenantExists = async (
  user: User,
  accessToken: string
): Promise<Tenant> => {
  const azureOrganization = await getOrganization(accessToken);

  // Check if Azure Organization exists for given access token
  if (!azureOrganization) {
    throw new Error("No Azure Organization found");
  }

  let tenant = await prisma?.tenant.findUnique({
    where: { azureTenantId: azureOrganization.id },
  });
  if (!tenant) {
    tenant = (await createTenant(azureOrganization)) || null;
    if (!tenant?.id) {
      throw new Error("Tenant ID is undefined");
    }
    if (user) {
      await prisma?.user.update({
        where: { id: user.id },
        data: { tenantId: tenant?.id },
      });
    }
  }

  if (!tenant?.id) {
    throw new Error("Tenant ID is undefined");
  }

  return tenant;
};

const ensureMSPExists = async (tenant: Tenant): Promise<Msp> => {
  let msp = await prisma?.msp.findUnique({
    where: { tenantId: tenant.id },
  });
  if (!msp) {
    msp = (await prisma?.msp.create({
      data: { tenantId: tenant.id, name: tenant.name },
      select: { id: true },
    })) as Msp;
  }
  return msp;
};

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user, token, ...rest }) {
      if (session.user && token) {
        session.user.provider = token?.provider as string;
        session.user.accountType = token?.accountType as string;
        session.user.providerId = token?.providerId as string;
        session.user.mspId = token?.mspId as string;
        session.user.endCustomerId = token?.endCustomerId as string;
        session.user.tenantId = token?.tenantId as string;
        session.user.id = token.userId as string;
        if (
          token.consentGiven === false &&
          token?.providerId &&
          token.providerId !== undefined
        ) {
          const tenant = await prisma.tenant.findUnique({
            select: { hasGivenConsent: true },
            where: { azureTenantId: token?.providerId as string },
          });
          token.consentGiven = tenant?.hasGivenConsent as boolean;
        }
        session.user.consentGiven = token.consentGiven as boolean;
      }
      return session;
    },
    async jwt({ token, account, profile, user, isNewUser }) {
      if (!profile || !account) {
        return token;
      }
      // Persist the OAuth access_token and or the user id to the token right after signin
      // adding provider access token to JWT
      let tenant: Tenant | null = null;
      let msp: Msp | null = null;
      let customer: Customer | null = null;

      if (isNewUser) {
        // Get Azure Organization

        // Ensure that tenant for current Azure Organization exists
        tenant = await ensureTenantExists(
          user as User,
          account?.access_token as string
        );

        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            tenant: { connect: { id: tenant.id } },
          },
        });

        if (tenant.accountType === "MSP") {
          msp = await ensureMSPExists(tenant);
        } else {
          customer = await prisma.customer.findUnique({
            where: { tenantId: tenant.id },
          });

          if (!customer?.isActivated) {
            await prisma.customer.update({
              where: { id: customer?.id },
              data: { isActivated: true },
            });
          }
        }

        // adding tenant id to JWT
      } else {
        tenant = await prisma.tenant.findUnique({
          where: { azureTenantId: profile?.tid },
        });
        if (tenant?.accountType === "MSP") {
          msp = await prisma.msp.findUnique({
            where: { tenantId: tenant?.id },
          });
        } else {
          customer = await prisma.customer.findUnique({
            where: { tenantId: tenant?.id },
          });
        }
      }
      token.accountType = tenant?.accountType;
      token.provider = "azure-ad";
      if (msp) {
        token.mspId = msp?.id;
      }
      if (customer) {
        token.endCustomerId = customer?.id;
      }
      token.accessToken = account?.access_token;
      token.providerId = tenant?.azureTenantId;
      token.consentGiven = tenant?.hasGivenConsent;
      token.audience = profile?.aud;
      token.tenantId = tenant?.id;
      token.userId = user?.id;
      return token;
    },
    async signIn({ user, account, profile, email, credentials, ...rest }) {
      return true;
    },

    // async signIn({ user, account, profile, email, credentials, ...rest }) {
    //   if (!user?.id) {
    //     return false;
    //   }

    //   const existingAccount = await prisma.account.findUnique({
    //     where: {
    //       provider_providerAccountId: {
    //         provider: account?.provider as string,
    //         providerAccountId: account?.providerAccountId as string,
    //       },
    //     },
    //   });
    //   if (existingAccount) {
    //     await prisma.account.update({
    //       where: {
    //         id: existingAccount.id,
    //       },
    //       data: {
    //         id_token: account?.id_token,
    //         access_token: account?.access_token,
    //         expires_at: account?.expires_at,
    //         refresh_token: account?.refresh_token,
    //         scope: account?.scope,
    //         provider: account?.provider,
    //         providerAccountId: account?.providerAccountId,
    //         session_state: account?.session_state,
    //         type: account?.type,
    //         userId: user?.id,
    //       },
    //     });
    //   }
    //   return true;
    // },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  // pages: {
  //   signIn: "/auth/signin",
  //   // signOut: "/auth/signout",
  //   // error: "/auth/error",
  //   // verifyRequest: "/auth/verify-request",
  //   // newUser: "/auth/new-user",
  // },
  // Configure one or more authentication providers
  adapter: getLinkedPrismaAdapter,
  providers: [
    AzureAD({
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  debug: true,
};

export default NextAuth(authOptions);
