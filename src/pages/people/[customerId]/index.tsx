import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import UsersTable from "../../../components/UsersTable";
import CustomerLayout from "../../../layouts/CustomerLayout";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

const MSPPeoplePage = () => {
  const router = useRouter();
  const { customerId } = router.query;
  if (!customerId) {
    router.back();
  }
  const users = trpc.user.getAllUsersByCustomerId.useQuery({
    customerId: customerId as string,
  });

  if (users.isLoading) {
    return <></>;
  }

  if (users.error) {
    router.back();
    return <div>Error while loading user</div>;
  }

  return (
    <CustomerLayout title="People">
      <UsersTable
        users={users.data}
        isMSPCustomerView={true}
        customerId={customerId as string}
      />
    </CustomerLayout>
  );
};

export default MSPPeoplePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session?.user?.accountType === "ENDCUSTOMER") {
    return {
      redirect: {
        destination: "/people",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
