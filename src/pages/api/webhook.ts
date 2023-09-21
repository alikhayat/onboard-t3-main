import * as bcrypt from "bcrypt";
import type { NextApiResponse } from "next";
import type { AxiomAPIRequest } from "next-axiom";
import { withAxiom } from "next-axiom";
import fetch from "node-fetch";
import { performance } from "perf_hooks";
import { env } from "process";
import { prisma } from "../../server/db/client";
const webhook = async (req: AxiomAPIRequest, res: NextApiResponse) => {
  try {
    if (req.query.validationToken) {
      req.log.warn(`Azure WEBHOOK: validation token is present`);
      res.status(200).send(req.query.validationToken);
      return;
    }

    if (req.query.secret) {
      for (const item of req.body.value) {
        const webhook = await prisma.webhook.findUniqueOrThrow({
          where: { secretHash: item?.clientState },
        });

        if (
          bcrypt?.compareSync(
            req.query.secret as string,
            webhook?.secretHash as string
          )
        ) {
          const params = new URLSearchParams();
          params.append("scope", "https://graph.microsoft.com/.default");
          params.append("client_id", env?.MICROSOFT_CLIENT_ID || "");
          params.append("client_secret", env?.MICROSOFT_CLIENT_SECRET || "");
          params.append("grant_type", "client_credentials");
          req.log.warn(
            `Azure WEBHOOK: started processing access token request`
          );

          const accessTokenResponse = await fetch(
            `https://login.microsoftonline.com/${item?.tenantId}/oauth2/v2.0/token`,

            {
              body: params,
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );

          const accessTokenResponseJson: { access_token: string } =
            (await accessTokenResponse.json()) as { access_token: string };
          const accessToken = accessTokenResponseJson?.access_token;
          req.log.warn(`Azure WEBHOOK: access token received`);

          const usersResponse = await fetch(
            `https://graph.microsoft.com/v1.0/users/${item?.resourceData?.id}?$select=displayName,userPrincipalName,department,jobTitle&$expand=manager($select=id,userPrincipalName)`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          const user = (await usersResponse.json()) as any;

          await prisma.user.upsert({
            create: {
              name: user.displayName,
              email: user.userPrincipalName,
              jobTitle: user.jobTitle,
              department: user.department,
              tenant: { connect: { azureTenantId: item?.tenantId } },
            },
            update: {
              name: user.displayName,
              jobTitle: user.jobTitle,
              department: user.department,
              tenant: { connect: { azureTenantId: item?.tenantId } },
            },
            where: { email: user.userPrincipalName },
          });
          const update = { text: `User ${user?.displayName} was updated` };
          await fetch(
            "https://hooks.slack.com/services/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",
            {
              body: JSON.stringify(update),
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          req.log.error(`hash missmatch!!!!!!`);
        }
      }

      res.status(200).send("OK");

      return;
    }
  } catch (e) {
    req.log.error(`ERROR : ${JSON.stringify(e, null, 2)}`);
    res.status(500).send(`Error: ${JSON.stringify(e, null, 2)}`);
  }

  res.status(500).send("NOT OK");
};

export default withAxiom(webhook);
