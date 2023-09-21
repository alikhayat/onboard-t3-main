import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession } from "next-auth/react";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function SignInPage({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const session = await getSession(context);
  if (session && session?.user && session?.user?.id) {
    return {
      props: {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      },
    };
  }
  return {
    props: { providers },
  };
}
