import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BuiltInProviderType } from "next-auth/providers";

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
export default function SignInPage({
  providers: provider,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(provider || null);

  useEffect(() => {
    (async () => {
      if (!provider) {
        const res = await getProviders();
        setProviders(res);
      }
    })();
  }, []);
  const router = useRouter();

  if (providers === null || providers === undefined || status === "loading") {
    return <div> Loading</div>;
  }
  if (session) {
    router.push("/dashboard");
  }
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-16 w-auto"
                src="/img/itos-logo.svg"
                alt="Your Company"
                height={64}
                width={64}
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-8">
              <div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Sign in with
                  </p>

                  <div className="mt-1 grid grid-cols-1 gap-3">
                    {providers &&
                      Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                          <a
                            onClick={() => {
                              signIn(
                                provider.id,
                                {
                                  callbackUrl: provider.callbackUrl,
                                },
                                { prompt: "select_account" }
                              );
                            }}
                            className="inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white py-2 px-4 align-middle text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                          >
                            <span className="sr-only">
                              Sign in with {provider.name}
                            </span>
                            <span className="mr-2">
                              Sign in with {provider.name}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 59.242 47.271"
                              width="24"
                              height="24"
                            >
                              <path
                                d="m32.368 0-17.468 15.145-14.9 26.75h13.437zm2.323 3.543-7.454 21.008 14.291 17.956-27.728 4.764h45.442z"
                                fill="#0072c6"
                              />
                            </svg>
                          </a>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="relative mt-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with:
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
            height={2048}
            width={2048}
          />
        </div>
      </div>
    </>
  );
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
