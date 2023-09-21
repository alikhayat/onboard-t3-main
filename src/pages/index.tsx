import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { log } from "next-axiom";
import Head from "next/head";
import LandingPage from "./components/LandingPage";

const Home = () => {
  log.warn("Home page rendered");

  return (
    <>
      <Head>
        <title>itOS: Onboard</title>
        <meta name="description" content="Put your onboarding on autopilot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingPage />;
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
