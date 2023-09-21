import { z } from "zod";

import { Customer } from "@prisma/client";
import { router, protectedProcedure, mspProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { getHostname } from "tldts";

const getTenantIdFromDomain = async (
  domain: string
): Promise<string | null> => {
  if (!domain) {
    return null;
  }
  try {
    const result: any = await axios.get<{ token_endpoint: string }>(
      `https://login.microsoftonline.com/${domain}/.well-known/openid-configuration`
    );
    if (!result?.data.token_endpoint) {
      return null;
    } else {
      return result?.data.token_endpoint.split("/")[3];
    }
  } catch (e) {
    return null;
  }
};

export const customerRouter = router({
  getAll: mspProcedure.input(z.void()).query(async ({ ctx }) => {
    if (!ctx?.session?.user?.mspId) {
      throw new TRPCError({
        message: "No MSP ID found in session",
        code: "UNAUTHORIZED",
      });
    }

    return ctx.prisma.customer.findMany({
      where: { managingMspId: ctx?.session?.user?.mspId },
      include: { tenant: { include: { users: true } } },
    });
  }),

  getCurrentCustomer: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.customer.findFirst({
      where: { id: ctx?.session?.user?.endCustomerId as string },
      include: { tenant: { include: { users: true } } },
    });
  }),

  getCustomerWithUsersById: mspProcedure
    .input(z.object({ customerId: z.string().min(25).max(25) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.customer.findFirst({
        where: { id: input.customerId },
        include: { tenant: { include: { users: true } } },
      });
    }),

  create: mspProcedure
    .input(
      z.object({
        companyName: z.string().min(2),
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx?.session?.user?.mspId) {
        throw new TRPCError({
          message: "No MSP ID found in session",
          code: "UNAUTHORIZED",
        });
      }

      const hostname = getHostname(input.email);
      if (!hostname) {
        throw new TRPCError({
          message: "Can't get hostname from email",
          code: "UNAUTHORIZED",
        });
      }
      const customerAzureTenantId = await getTenantIdFromDomain(hostname);

      if (!customerAzureTenantId) {
        throw new TRPCError({
          message: "Can't get Azure Tenant ID from email",
          code: "UNAUTHORIZED",
        });
      }
      let customerTenant = await ctx.prisma.tenant.findUnique({
        where: { azureTenantId: customerAzureTenantId },
      });

      if (customerTenant?.id) {
        throw new TRPCError({
          message: "Can't invite customer, tenant already exists",
          code: "CONFLICT",
        });
      }

      if (!customerTenant) {
        customerTenant = await ctx.prisma.tenant.create({
          data: {
            name: input.companyName,
            azureTenantId: customerAzureTenantId,
            accountType: "ENDCUSTOMER",
          },
        });
      }

      const customer: any = await ctx.prisma.customer.create({
        data: {
          name: input.companyName,
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          tenant: { connect: { id: customerTenant.id } },
          managingMsp: { connect: { id: ctx?.session?.user?.mspId } },
          workflows: {
            create: [
              {
                name: "Employee Onboarding",
                description:
                  "Workflow used to prepare working environmet for new employee",
                workflowType: "ONBOARDING",
                steps: {
                  create: [
                    {
                      name: "Setup accounts",
                      workflowStepType: "ACCOUNT_SETUP",

                      description: "",
                      items: {
                        create: [
                          {
                            name: "Create Office 365 account",
                            description:
                              "Ensure that Office 365 account is created before employee's day 1",
                            required: true,
                          },
                          {
                            name: "Enable MFA and Enforce MFA",
                            description:
                              "Ensure that MFA is enabled and enforced on user's account",
                            required: true,
                          },
                          {
                            name: "Email bounce back test",
                            description:
                              "Ensure that email is not bouncing back so that mail can be sent to user",
                            required: true,
                          },
                          {
                            name: "Add user to Groups/Distribution lists",
                            description:
                              "Ensure that user is added to appropriate groups and distribution lists",
                            required: true,
                          },
                          {
                            name: "Install Edge Networks security stack/ NinjaRMM",
                            description:
                              "Ensure that user is added to appropriate groups and distribution lists",
                            required: true,
                          },
                        ],
                      },
                    },

                    {
                      name: "SaaS",
                      description: "",
                      workflowStepType: "SAAS",

                      items: {
                        create: [
                          {
                            name: "Jira",
                            description: "Give user access to Jira",
                            required: false,
                          },
                          {
                            name: "Slack",
                            description: "Give user access to Slack",
                            required: false,
                          },
                        ],
                      },
                    },
                    {
                      name: "Communication",
                      workflowStepType: "COMMUNICATION",

                      description: "",
                      items: {
                        create: [
                          {
                            name: "Verify new machine successful setup",
                            description:
                              "Contact manager/user to schedule a time to help setup the new machine",
                            required: true,
                          },
                          {
                            name: "Verify user access to the assigned machine",
                            description:
                              "Make sure user can log into the assigned machine",
                            required: true,
                          },
                          {
                            name: "Verify application instalation",
                            description:
                              "Make sure applications are installed, reach out for confirmation if not in Support ticket",
                            required: true,
                          },
                          {
                            name: "Verify user access to Office.com",
                            description:
                              "Make sure user can log into Office.com as well as the Microsoft apps on the machine",
                            required: true,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                name: "Onboarding Options",
                description: "Workflow used to assist with onboarding workflow",
                workflowType: "ONBOARDING_OPTIONS",

                steps: {
                  create: [
                    {
                      name: "Setup accounts",
                      description: "",
                      workflowStepType: "ACCOUNT_SETUP",

                      items: {
                        create: [
                          {
                            name: "Allow user admin rights on machine",
                            description:
                              "Ensure that user has admin rights on their machine",
                            required: false,
                          },
                        ],
                      },
                    },

                    {
                      name: "SaaS",
                      description: "",
                      workflowStepType: "SAAS",

                      items: {
                        create: [
                          {
                            name: "AWS",
                            description: "Give user access to AWS",
                            required: false,
                          },
                          {
                            name: "Bitbucket",
                            description: "Give user access to Bitbucket",
                            required: false,
                          },
                          {
                            name: "Onshape",
                            description: "Give user access to Onshape",
                            required: false,
                          },
                        ],
                      },
                    },
                    {
                      name: "Communication",
                      description: "",
                      workflowStepType: "COMMUNICATION",

                      items: {
                        create: [],
                      },
                    },
                  ],
                },
              },
              {
                name: "Employee Offboarding",
                description: "Workflow used to offboard employee",
                workflowType: "OFFBOARDING",
                steps: { create: [] },
              },
            ],
          },
        },
      });

      return customer;
    }),
});
