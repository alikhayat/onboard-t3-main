import type { User } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import UserDetails from "../../../../../components/UserDetails";
import CustomerLayout from "../../../../../layouts/CustomerLayout";
import { trpc } from "../../../../../utils/trpc";
import { isCuid } from "cuid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { id } from "date-fns/locale";

const People = () => {
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

export default People;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (
    !isCuid(context.query.customerId as string) ||
    !isCuid(context.query.userId as string)
  ) {
    return {
      redirect: {
        destination: !context?.req?.headers?.referer
          ? "/dashboard/msp"
          : context.req.headers.referer,
        permanent: false,
      },
    };
  }
  if (session?.user?.accountType === "ENDCUSTOMER") {
    if (!session.user.consentGiven) {
      return {
        redirect: {
          destination: "/people",
          permanent: false,
        },
      };
    }
  }

  return {
    props: { session },
  };
}
