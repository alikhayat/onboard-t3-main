import { GetServerSidePropsContext } from "next";
import ConsentGiven from "../../components/ConsentGiven";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function Consent() {
  return (
    <CustomerLayout title="Consent">
      <ConsentGiven />
    </CustomerLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
