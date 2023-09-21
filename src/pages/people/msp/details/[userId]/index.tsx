import type { User } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import UserDetails from "../../../../../components/UserDetails";
import AuthorizedLayout from "../../../../../layouts/AuthorizedLayout";
import CustomerLayout from "../../../../../layouts/CustomerLayout";
import { trpc } from "../../../../../utils/trpc";

const MSPPersonDetailPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const user = trpc.user.getMSPEmployeeById.useQuery({
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
    <AuthorizedLayout title="People">
      <UserDetails user={user.data as User} />
    </AuthorizedLayout>
  );
};

export default MSPPersonDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session?.user?.accountType === "ENDCUSTOMER") {
    return {
      redirect: {
        destination: "/people",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
