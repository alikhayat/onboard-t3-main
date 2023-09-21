import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import AlertBanner, { AlertBannerType } from "../../components/AlertBannert";
import ConsentForm from "../../components/ConsentForm";
import CustomerLayout from "../../layouts/CustomerLayout";

interface ConsentProps {
  NEXTAUTH_URL: string;
  session: Session | null;
}

function getErrorMessageFromCode(code: string) {
  if (code === "Consent_not_given") {
    return "You must give consent to continue.";
  }
  if (code) {
    return code;
  }
  return null;
}
export default function Consent(props: ConsentProps) {
  const router = useRouter();
  const { error } = router.query;
  const errorMessage = getErrorMessageFromCode(error as string);
  return (
    <CustomerLayout title="Consent">
      {errorMessage && (
        <AlertBanner title={errorMessage} type={AlertBannerType.Error} />
      )}
      {!errorMessage && (
        <AlertBanner
          title="In order to function properly itOS needs your consent to access and manage your information."
          type={AlertBannerType.Info}
        />
      )}
      <ConsentForm NEXTAUTH_URL={props.NEXTAUTH_URL} />
    </CustomerLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session, NEXTAUTH_URL },
  };
}
