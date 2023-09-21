import axios from "axios";
import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { env } from "process";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "../../server/db/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { addDays } from "date-fns";
import { log } from "next-axiom";

export default function Consent() {
  log.warn("Consent page loaded");
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  log.info(`UserID: ${JSON.stringify(session?.user?.id)}`);
  log.info(`CustomerID: ${JSON.stringify(session?.user?.endCustomerId)}`);
  log.info(`ConsentGiven: ${JSON.stringify(session?.user?.consentGiven)}`);

  if (session?.user?.accountType === "ENDCUSTOMER") {
    if (!session.user.consentGiven) {
      const params = new URLSearchParams();
      params.append("scope", "https://graph.microsoft.com/.default");
      params.append("client_id", env?.MICROSOFT_CLIENT_ID || "");
      params.append("client_secret", env?.MICROSOFT_CLIENT_SECRET || "");
      params.append("grant_type", "client_credentials");
      // REQUESTING ACCESS TOKEN
      let start = performance.now();
      try {
        const accessTokenResponse = await axios.post<any>(
          `https://login.microsoftonline.com/${session.user.providerId}/oauth2/v2.0/token`,

          params
        );
        log.info(
          `Time to get access token: ${performance.now() - start} milliseconds`
        );

        const accessToken = accessTokenResponse.data.access_token;
        if (accessToken) {
          start = performance.now();
          const usersResponse = await axios.get<any>(
            `https://graph.microsoft.com/v1.0/users?$select=displayName,userPrincipalName,department,jobTitle&$filter=accountEnabled eq true`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          log.info(
            `Time to get users: ${performance.now() - start} milliseconds`
          );
          log.info(
            `Got ${usersResponse?.data?.value?.length} users from Microsoft Graph`
          );
          const awaiter: any[] = [];
          start = performance.now();
          usersResponse?.data?.value?.map(async (u: any) => {
            awaiter.push(
              prisma.user.upsert({
                create: {
                  name: u.displayName,
                  email: u.userPrincipalName,
                  jobTitle: u.jobTitle,
                  department: u.department,
                  tenant: { connect: { id: session.user?.tenantId } },
                },
                update: {
                  name: u.displayName,
                  jobTitle: u.jobTitle,
                  department: u.department,
                  tenant: { connect: { id: session.user?.tenantId } },
                },
                where: { email: u.userPrincipalName },
              })
            );
          });

          await Promise.all(awaiter);
          log.info(
            `Time to upsert users: ${performance.now() - start} milliseconds`
          );
          start = performance.now();
          const getAllSubscriptions = await axios.get(
            `https://graph.microsoft.com/v1.0/subscriptions`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          log.info(
            `Time to get subscriptions: ${
              performance.now() - start
            } milliseconds`
          );
          log.info(
            `Got ${getAllSubscriptions?.data?.value?.length} subscriptions from Microsoft Graph`
          );
          const deleter: Promise<any>[] = [];
          start = performance.now();
          getAllSubscriptions.data.value?.map(async (s: any) => {
            deleter.push(
              axios.delete(
                `https://graph.microsoft.com/v1.0/subscriptions/${s.id}`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              )
            );
          });

          await Promise.all(deleter);
          log.info(
            `Time to delete subscriptions: ${performance.now() - start}`
          );

          const secret = crypto.randomBytes(48).toString("hex");
          const hash = await bcrypt.hash(secret, 2);
          log.info(`Hash: ${hash}`);
          start = performance.now();
          const webhook = await prisma.webhook.create({
            data: {
              tenant: { connect: { id: session.user?.tenantId } },
              url: `${env.NEXTAUTH_URL}/api/webhook?secret=${secret}`,
              secretHash: hash,
            },
          });
          log.info(
            `Time to create webhook in database: ${performance.now() - start}`
          );
          start = performance.now();
          await axios
            .post(
              `https://graph.microsoft.com/v1.0/subscriptions`,
              {
                changeType: "updated",
                notificationUrl: webhook.url,
                resource: "users",
                expirationDateTime: addDays(new Date(), 2),
                clientState: webhook.secretHash,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            .then(
              (res) => {
                log.info(
                  `Time to create subscription in Microsoft Graph: ${
                    performance.now() - start
                  } milliseconds`
                );
                log.info(`SubscriptionID: ${res?.data?.id}`);
              },
              (err) => {
                log.error(`Error: ${JSON.stringify(err, null, 2)}`);
              }
            );
          start = performance.now();
          await prisma?.tenant.update({
            where: { azureTenantId: session.user.providerId },
            data: { hasGivenConsent: true },
          });

          log.info(`Time to update tenant: ${performance.now() - start}`);

          return {
            redirect: {
              destination: "/consent/given",
              permanent: false,
            },
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const { error } = context.query;

  if (error) {
    if (error === "access_denied") {
      return {
        redirect: {
          destination: "/consent?error=Consent_not_given",
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: `/consent?error=${error}`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/consent/given",
      permanent: false,
    },
  };
}
