import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export default function Environment(props: any) {
  return <>{JSON.stringify(props.env)}</>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context.query.pass === "cmonwork") {
    const variable = process.env;
    return {
      props: { env: variable },
    };
  }

  return {
    props: {},
  };
}
