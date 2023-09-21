import { z } from "zod";

import { router, protectedProcedure, mspProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  // Returns all users for the current tenant
  getAllTenantUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      where: { tenant: { id: ctx?.session?.user?.tenantId } },
    });
  }),

  // Returns all users for a given customerId
  // if they are managed by the current MSP
  getAllUsersByCustomerId: mspProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          tenant: {
            Customer: {
              id: input.customerId,
              managingMsp: { id: ctx?.session?.user?.mspId as string },
            },
          },
        },
      });
    }),

  // Returns user for a given customerId and userId
  // if they are managed by the current MSP
  getUserByCustomerIdAndUserId: mspProcedure
    .input(
      z.object({
        customerId: z.string().min(25).max(25), // all CUIDs are 25 characters long
        userId: z.string().min(25).max(25), // all CUIDs are 25 characters long
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: input.userId,
          tenant: {
            Customer: {
              id: input.customerId,
              managingMsp: { id: ctx?.session?.user?.mspId as string },
            },
          },
        },
      });
    }),

  // Returns user for a given userId if belongs to the current tenant
  getUserById: protectedProcedure
    .input(z.object({ userId: z.string().min(25).max(25) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: input.userId,
          tenant: { id: ctx?.session?.user?.tenantId },
        },
      });
    }),

  // Returns all users for the current MSP
  getMSPEmployees: mspProcedure.query(async ({ ctx }) => {
    if (!ctx?.session?.user?.mspId) {
      throw new TRPCError({
        message: "invalid input",
        code: "UNAUTHORIZED",
      });
    }
    return await ctx.prisma.user.findMany({
      where: {
        tenant: {
          id: ctx?.session?.user?.tenantId,
          msp: { id: ctx.session.user.mspId },
        },
      },
    });
  }),

  // Returns user for a given userId if belongs to the current MSP
  getMSPEmployeeById: mspProcedure
    .input(z.object({ userId: z.string().min(25).max(25) }))
    .query(async ({ ctx, input }) => {
      if (!ctx?.session?.user?.mspId) {
        throw new TRPCError({
          message: "invalid input",
          code: "UNAUTHORIZED",
        });
      }
      return await ctx.prisma.user.findFirst({
        where: {
          id: input?.userId,
          tenant: {
            id: ctx?.session?.user?.tenantId,
            msp: { id: ctx.session.user.mspId },
          },
        },
      });
    }),

  // Returns total user count managed by the current MSP
  getTotalManagedUserCount: mspProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.mspId) {
      throw new TRPCError({
        message: "invalid input",
        code: "UNAUTHORIZED",
      });
    }
    return await ctx.prisma.user.count({
      where: {
        tenant: { Customer: { managingMsp: { id: ctx.session.user.mspId } } },
      },
    });
  }),
});
