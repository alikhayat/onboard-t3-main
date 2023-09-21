import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const workflowRouter = router({
  getCustomerWorkflow: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.workflow.findMany({
        where: { customerId: input.customerId },
        include: { steps: { include: { items: true } } },
      });
    }),
  getSoftwareStep: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workflowStep.findFirst({
      include: { items: true },
      where: {
        workflow: {
          customerId: ctx.session.user.endCustomerId,
          workflowType: "ONBOARDING",
        },
        workflowStepType: "SOFTWARE",
      },
    });
  }),

  associateWorkItemWithWorkflowStep: protectedProcedure
    .input(
      z.object({
        stepId: z.string(),
        itemId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.itemId !== null) {
        await ctx.prisma.workflowStep.update({
          where: { id: input.stepId },
          data: {
            items: {
              connect: { id: input.itemId },
            },
          },
        });
      }
    }),
});
