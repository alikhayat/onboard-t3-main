import type { GetServerSidePropsContext } from "next/types";
import WorkflowPanel from "../../../components/WorkflowPanel";
import CustomerLayout from "../../../layouts/CustomerLayout";
import { trpc } from "../../../utils/trpc";
import { useSession, getSession } from "next-auth/react";
import ModuleCard from "../../../components/ModuleCard";
import { useRouter } from "next/router";

export default function WorkflowBuilderCustomerPage(props: any) {
  const session = useSession();
  const router = useRouter();

  const { customerId } = router.query;
  const currentWorkflow = trpc.workflow.getCustomerWorkflow.useQuery({
    customerId: customerId as string,
  });

  const onboardingWorkflow = currentWorkflow?.data?.find(
    (a) => a.workflowType === "ONBOARDING"
  );
  const onboardingOptionsWorkflow = currentWorkflow?.data?.find(
    (a) => a.workflowType === "ONBOARDING_OPTIONS"
  );

  if (
    currentWorkflow.isLoading ||
    !currentWorkflow.data ||
    !onboardingWorkflow ||
    !onboardingOptionsWorkflow
  ) {
    return <div>Loading...</div>;
  }
  return (
    <CustomerLayout title="Workflow Builder">
      <ModuleCard
        title="Personal & Contact Information"
        description="Asks about new employee personal and contact information"
        buttonLabel="Edit Module"
        buttonOnClick={() =>
          router.push("/workflow-builder/onboarding/personal-details")
        }
      />
      <ModuleCard
        title="Assets & Applications for new employee"
        description="Asks about assests that need to be assigned to new employee"
        buttonLabel="Edit Module"
        buttonOnClick={() =>
          router.push("/workflow-builder/onboarding/personal-details")
        }
      />

      <WorkflowPanel
        currentWorkflow={onboardingWorkflow.steps}
        optionalSteps={onboardingOptionsWorkflow.steps}
      />
    </CustomerLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session?.user?.accountType === "ENDCUSTOMER") {
    if (!session.user.consentGiven) {
      return {
        redirect: {
          destination: "/consent",
          permanent: false,
        },
      };
    }
  }
  if (!session?.user?.accountType) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session?.user?.accountType === "MSP") {
    return {
      redirect: {
        destination: "/workflow-builder",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
