import type { User } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import UserDetails from "../../../../../components/UserDetails";
import CustomerLayout from "../../../../../layouts/CustomerLayout";
import { trpc } from "../../../../../utils/trpc";

const PeopleDetailsEdit = () => {
  const router = useRouter();
  const { customerId, userId } = router.query;
  const user = trpc.user.getUserByCustomerIdAndUserId.useQuery({
    customerId: customerId as string,
    userId: userId as string,
  });

  if (user.isLoading) {
    return <></>;
  }

  if (user.error || !user) {
    router.back();
    return <div>Error while loading user</div>;
  }

  return (
    <CustomerLayout title="People">
      <UserDetails user={user.data as User} />
    </CustomerLayout>
  );
};

export default PeopleDetailsEdit;

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
