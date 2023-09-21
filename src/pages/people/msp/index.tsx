import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import UsersTable from "../../../components/UsersTable";
import AuthorizedLayout from "../../../layouts/AuthorizedLayout";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

const MSPUsers = () => {
  const router = useRouter();
  const user = trpc.user.getAllTenantUsers.useQuery();

  if (user.isLoading) {
    return <></>;
  }

  if (user.error) {
    router.back();
    return <div>Error while loading user</div>;
  }

  return (
    <AuthorizedLayout title="People">
      <UsersTable users={user.data} isMSPCustomerView={false} />
    </AuthorizedLayout>
  );
};

export default MSPUsers;

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
