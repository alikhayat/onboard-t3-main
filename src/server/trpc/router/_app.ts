import { router } from "../trpc";
import { authRouter } from "./auth";
import { azureRouter } from "./azure";
import { customerRouter } from "./customer";
import { deviceRouter } from "./device";
import { onboardingRouter } from "./onboarding";
import { userRouter } from "./user";
import { workflowRouter } from "./workflow";

export const appRouter = router({
  auth: authRouter,
  azure: azureRouter,
  customer: customerRouter,
  user: userRouter,
  workflow: workflowRouter,
  onboarding: onboardingRouter,
  device: deviceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
