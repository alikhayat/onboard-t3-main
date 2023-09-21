import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import { env } from "../../../env/server.mjs";

import { router, protectedProcedure } from "../trpc";

export const azureRouter = router({
  getAllDomains: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch("https://graph.microsoft.com/v1.0/domains", {
        headers: { Authorization: `Bearer ${input.accessToken}` },
      });
      return await response.json();
    }),

  fetchAllAssets: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      //FORMATING THE REQUEST BODY, TO GET ACCESS TOKEN (graph.microsoft.com requires this type of body)
      const params = new URLSearchParams();
      params.append("scope", "https://graph.microsoft.com/.default");
      params.append("client_id", env.MICROSOFT_CLIENT_ID);
      params.append("client_secret", env.MICROSOFT_CLIENT_SECRET);
      params.append("grant_type", "client_credentials");
      // REQUESTING ACCESS TOKEN
      try {
        const accessTokenResponse = await axios.post<any>(
          `https://login.microsoftonline.com/${input}/oauth2/v2.0/token`,

          params
        );
        const accessToken = accessTokenResponse.data.access_token;
        const managedDevicesResponse = await axios.get<any>(
          `https://graph.microsoft.com/v1.0/deviceManagement/managedDevices?$filter=managedDeviceOwnerType eq 'company'`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        return managedDevicesResponse.data;
      } catch (error) {
        throw new TRPCError({
          message:
            "Failed to get access token : 4599374b-010c-5c28-b5bf-4444444",
          code: "UNAUTHORIZED",
        });
      }
    }),
});
