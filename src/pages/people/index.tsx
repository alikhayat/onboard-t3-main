import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import UsersTable from "../../components/UsersTable";
import CustomerLayout from "../../layouts/CustomerLayout";
import { trpc } from "../../utils/trpc";

const CustomerPeoplePage = () => {
  const session = useSession();
  const getUsers = trpc.user.getAllTenantUsers.useQuery();
  if (getUsers.isLoading) {
    return <></>;
  }

  if (getUsers.error) {
    return <div>Error while loading users</div>;
  }

  return (
    <CustomerLayout title="People">
      <UsersTable
        users={getUsers.data}
        isMSPCustomerView={false}
        customerId={session.data?.user?.endCustomerId as string}
      />
    </CustomerLayout>
  );
};

export default CustomerPeoplePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session?.user?.tenantId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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
  return {
    props: { session },
  };
}
