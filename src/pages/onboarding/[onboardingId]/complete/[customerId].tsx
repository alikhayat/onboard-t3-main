import { useRouter } from "next/router";
import ProgressBar from "../../../../components/ProgressBar";
import AuthorizedLayout from "../../../../layouts/AuthorizedLayout";

export default function Complete() {
  const router = useRouter();
  function handleNext() {
    router.push("/dashboard");
  }
  return (
    <AuthorizedLayout title="Onboarding">
      <>
        <div>
          {/* Progress bar plase */}
          <ProgressBar stepIndex={3} />
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="mt-8 md:grid md:grid-cols-1 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-center text-lg font-medium leading-6 text-gray-900">
                  That&apos;s it!
                </h3>
                <p className="text-no-wrap mt-4 text-center text-sm text-gray-600">
                  John Smith will start on Jan 1 as requested. On their first
                  day, they will recieve a text message with a link to a First
                  Day portal.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => handleNext()}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Dashboard
            </button>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
      </>
    </AuthorizedLayout>
  );
}
