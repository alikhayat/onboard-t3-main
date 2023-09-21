import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, mspProcedure } from "../trpc";
import { z } from "zod";
import { Customer, DeviceComponent } from "@prisma/client";

export const deviceRouter = router({
  getDeviceTemplatesByCustomerId: mspProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!input) {
        throw new TRPCError({
          message: "invalid input",
          code: "UNAUTHORIZED",
        });
      }
      const currentCustomer = (await ctx.prisma.customer.findFirst({
        where: { id: input },
      })) as Customer;

      if (currentCustomer.managingMspId === ctx.session.user.mspId) {
        return ctx.prisma.deviceTemplate.findMany({
          where: { customer: { id: input } },
          include: { deviceComponents: true },
        });
      } else {
        throw new TRPCError({
          message: "Not authorized",
          code: "UNAUTHORIZED",
        });
      }
    }),
  getAllDeviceTemplates: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.endCustomerId) {
      throw new TRPCError({
        message: "Authentication Error",
        code: "UNAUTHORIZED",
      });
    }
    return await ctx.prisma.deviceTemplate.findMany({
      where: { customer: { id: ctx.session.user.endCustomerId } },
      include: { deviceComponents: true },
    });
  }),
  mspCreateDeviceTemplate: mspProcedure
    .input(
      z.object({
        name: z.string().min(2),
        type: z.string(),
        deviceComponents: z
          .object({ value: z.string(), label: z.string() })
          .array(),
        customerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input) {
        return false;
      }
      const deviceTemplate: any = await ctx.prisma.deviceTemplate.create({
        data: {
          name: input.name,
          deviceType: input.type,
          customerId: input.customerId,
          deviceComponents: { create: input.deviceComponents },
        },
      });
      return deviceTemplate;
    }),

  createDeviceTemplate: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        type: z.string(),
        deviceComponents: z
          .object({ value: z.string(), label: z.string() })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.endCustomerId) {
        throw new TRPCError({
          message: "Authentication Error",
          code: "UNAUTHORIZED",
        });
      }
      if (!input) {
        return false;
      }
      const deviceTemplate: any = await ctx.prisma.deviceTemplate.create({
        data: {
          name: input.name,
          deviceType: input.type,
          customerId: ctx.session.user.endCustomerId,
          deviceComponents: { create: input.deviceComponents },
        },
      });
      return deviceTemplate;
    }),

  getAllDeviceComponents: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.endCustomerId) {
      throw new TRPCError({
        message: "Authentication Error",
        code: "UNAUTHORIZED",
      });
    }

    return await ctx.prisma.deviceComponent.findMany({
      where: {
        deviceTemplate: {
          customerId: ctx.session.user.endCustomerId,
        },
      },
    });
  }),
  //
  addDeviceComponent: protectedProcedure
    .input(
      z.object({
        label: z.string().min(2),
        value: z.string(),
        deviceTemplateId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deviceComponent: DeviceComponent =
        await ctx.prisma.deviceComponent.create({
          data: {
            label: input.label,
            value: input.value,
            deviceTemplateId: input.deviceTemplateId,
          },
        });
      return deviceComponent;
    }),
  // METHOD FOR REASSIGN COMPONENT TO DIFFERENT TEMPLATE
  assignComponentToTemplate: protectedProcedure
    .input(
      z.object({
        deviceComponentId: z.string(),
        deviceTemplateId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deviceComponent = await ctx.prisma.deviceComponent.update({
          where: { id: input.deviceComponentId },
          data: { deviceTemplateId: input.deviceTemplateId },
        });
        return deviceComponent;
      } catch {
        throw new TRPCError({
          message: "Assign Error",
          code: "UNAUTHORIZED",
        });
      }
    }),
  deleteDeviceTemplate: protectedProcedure
    .input(z.object({ deviceTemplateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.deviceTemplate.deleteMany({
        where: {
          id: input.deviceTemplateId,
          customerId: ctx.session.user.endCustomerId as string,
        },
      });
    }),
});
