import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import ProgressBar from "../../../../../../components/ProgressBar";
import CustomerLayout from "../../../../../../layouts/CustomerLayout";

export default function OnboardingInfo() {
  const router = useRouter();
  const { onboardingId, customerId } = router.query;
  function handleNext(): void {
    router.push(`/onboarding/msp/${customerId}/${onboardingId}/assets`);
  }

  return (
    <CustomerLayout title="Onboarding">
      <>
        <div>
          {/* Progress bar plase */}
          <ProgressBar stepIndex={0} />
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Personal Info
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Provide personal info
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4"></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="m-4"> </div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Contact Info
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Provide personal info
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="mobile-number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          name="mobile-number"
                          id="mobile-number"
                          autoComplete="mobile-number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          autoComplete="location"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="personal-email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Personal Email
                        </label>
                        <input
                          type="text"
                          name="personal-email"
                          id="personal-email"
                          autoComplete="personal-email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleNext()}
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
      </>
    </CustomerLayout>
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
