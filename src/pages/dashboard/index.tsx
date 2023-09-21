import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next/types";
import CustomerLayout from "../../layouts/CustomerLayout";
import { trpc } from "../../utils/trpc";
import CustomerStats, {
  EndCustomerStatsType,
} from "../components/CustomerStats";
import MSPStats from "../components/MSPStats";
import UpcomingFeed from "../components/UpcomingFeed";
import UsersTable from "../../components/UsersTable";
import { User } from "@prisma/client";

export default function CustomerDashboardPage() {
  // TODO: Fetch the current customer from the tRPC query
  const currentCustomer = trpc.customer.getCurrentCustomer.useQuery();

  if (currentCustomer.isLoading) {
    return <></>;
  }

  if (currentCustomer.isError) {
    return <div>Error while loading customer</div>;
  }

  const customerProps: EndCustomerStatsType = {
    numberOfPeople: currentCustomer?.data?.tenant?.users?.length || 0,
    numberOfOnboardings: 0,
    avgOnboardingProgress: 0,
  };

  return (
    <CustomerLayout title={`${currentCustomer?.data?.name || ""}`}>
      <div className="pt-8">
        <CustomerStats values={customerProps} />
      </div>
      <div className="pt-8">
        <UsersTable
          customerId={currentCustomer?.data?.id}
          users={currentCustomer?.data?.tenant?.users as User[]}
        />
      </div>
      <div className="pt-8">
        <UpcomingFeed />
      </div>
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
  } else {
    return {
      redirect: {
        destination: "/dashboard/msp",
        permanent: false,
      },
    };
  }
  if (!session?.user?.accountType) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
