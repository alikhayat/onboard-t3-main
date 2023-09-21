import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import UsersTable from "../../../components/UsersTable";
import CustomerLayout from "../../../layouts/CustomerLayout";
import { trpc } from "../../../utils/trpc";
import type { EndCustomerStatsType } from "../../components/CustomerStats";
import CustomerStats from "../../components/CustomerStats";
import UpcomingFeed from "../../components/UpcomingFeed";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { customerId } = router.query;

  const customer = trpc.customer.getCustomerWithUsersById.useQuery({
    customerId: customerId as string,
  });

  if (customer.isLoading) {
    return <></>;
  }
  if (customer.isError || !customer || !customer?.data?.tenant?.users) {
    router.back();
    return <div>Error while loading customer</div>;
  }
  const customerProps: EndCustomerStatsType = {
    numberOfPeople: customer?.data?.tenant?.users?.length || 0,
    numberOfOnboardings: 0,
    avgOnboardingProgress: 0,
  };

  return (
    <CustomerLayout
      title={`${customer?.data?.name} ${customer?.data?.tenant?.users?.length}`}
    >
      <div className="pt-8">
        <CustomerStats values={customerProps} />
      </div>
      <div className="pt-8">
        <UsersTable
          users={customer?.data?.tenant?.users as User[]}
          customerId={customerId as string}
          isMSPCustomerView={true}
        />
      </div>
      <div className="pt-8">
        <UpcomingFeed />
      </div>
    </CustomerLayout>
  );
}
