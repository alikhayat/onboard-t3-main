import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import UserDetails from "../../../../components/UserDetails";
import CustomerLayout from "../../../../layouts/CustomerLayout";
import { trpc } from "../../../../utils/trpc";

const CustomerPeopleDetailPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const user = trpc.user.getUserById.useQuery({ userId: userId as string });

  if (user.isLoading) {
    return <></>;
  }

  if (user.error) {
    router.back();
    return <div>Error while loading user</div>;
  }

  return (
    <CustomerLayout title="People">
      <UserDetails user={user.data} />
    </CustomerLayout>
  );
};

export default CustomerPeopleDetailPage;

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

  return {
    props: { session },
  };
}
