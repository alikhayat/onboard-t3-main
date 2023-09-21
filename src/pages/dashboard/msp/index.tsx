import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import AuthorizedLayout from "../../../layouts/AuthorizedLayout";
import Stats from "../../components/CustomerStats";
import UpcomingFeed from "../../components/UpcomingFeed";
import UsersTable from "../../../components/UsersTable";
import { trpc } from "../../../utils/trpc";
import MspStats, { MSPStatsType } from "../../components/MSPStats";

export default function Dashboard() {
  const users = trpc.user.getAllTenantUsers.useQuery();

  if (users.isLoading) {
    return <></>;
  }

  if (users.error) {
    return <div>Error while loading users</div>;
  }

  const mspStats: MSPStatsType = {
    numberOfCompanies: users?.data?.length || 0,
    numberOfUsersManaged: 0,
    numberOfOpenRequests: 0,
  };

  return (
    <AuthorizedLayout title="Dashboard">
      <div className="pt-8">
        <MspStats values={mspStats} />
      </div>
      <div className="pt-8">
        <UsersTable users={users.data} />
      </div>
      <div className="pt-8">
        <UpcomingFeed />
      </div>
    </AuthorizedLayout>
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
    return {
      redirect: {
        destination: "/dashboard",
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
