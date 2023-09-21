import { OnboardingTask, WorkflowStep } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { pl } from "date-fns/locale";
import { z } from "zod";
import { router, protectedProcedure, mspProcedure } from "../trpc";

export const onboardingRouter = router({
  getAllOnboardings: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.endCustomerId) {
      throw new TRPCError({
        message: "Authentication Error",
        code: "UNAUTHORIZED",
      });
    }
    return await ctx.prisma.onboarding.findMany({
      where: {
        customer: { id: ctx.session.user.endCustomerId },
      },
    });
  }),

  createOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.endCustomerId) {
      throw new TRPCError({
        message: "Authentication Error",
        code: "UNAUTHORIZED",
      });
    }
    const workflow = await ctx.prisma.workflow.findFirstOrThrow({
      where: {
        customer: { id: ctx.session.user.endCustomerId },
        workflowType: "ONBOARDING",
      },
      include: { steps: { include: { items: true } } },
    });

    const onboarding = await ctx.prisma.onboarding.create({
      data: {
        workflow: { connect: { id: workflow.id } },
        customer: { connect: { id: ctx.session.user.endCustomerId } },
        tasks: {
          create: [
            ...(workflow.steps as any[]).reduce((p, s) => {
              p.push(
                ...(s.items as any[]).map((i) => {
                  return {
                    name: i.name,
                    stepName: s.name,
                    workflowStep: { connect: { id: s.id } },
                    workflowItem: { connect: { id: i.id } },
                  };
                })
              );
              return p;
            }, [] as any[]),
          ],
        },
      },
      include: { tasks: true },
    });
    return onboarding;
  }),

  createOnboardingForCustomer: mspProcedure
    .input(z.object({ customerId: z.string().min(25).max(25) }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await ctx.prisma.workflow.findFirstOrThrow({
        where: {
          customer: { id: input.customerId },
          workflowType: "ONBOARDING",
        },
        include: { steps: { include: { items: true } } },
      });

      const onboarding = await ctx.prisma.onboarding.create({
        data: {
          workflow: { connect: { id: workflow.id } },
          customer: { connect: { id: input.customerId } },
          tasks: {
            create: [
              ...(workflow.steps as any[]).reduce((p, s) => {
                p.push(
                  ...(s.items as any[]).map((i) => {
                    return {
                      name: i.name,
                      stepName: s.name,
                      workflowStep: { connect: { id: s.id } },
                      workflowItem: { connect: { id: i.id } },
                    };
                  })
                );
                return p;
              }, [] as any[]),
            ],
          },
        },
        include: { tasks: true },
      });
      return onboarding;
    }),
});
