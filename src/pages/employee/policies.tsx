import EmployeeOnboardingLayout from "../../layouts/EmployeeOnboardingLayout";

export default function EmployeePoliciesPage() {
  return (
    <EmployeeOnboardingLayout currentStep={1}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">
              First Day Onboarding
            </h2>
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              IT Policies
            </p>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              View and accept the IT usage policies below.
            </p>
          </div>
        </div>
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Device Use Policy
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>This policy governs acceptable uses of Acme Corp devices.</p>
            </div>
            <div className="mt-3 text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Read policy
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Privacy Policy
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                What we do with the data we keep on your usage of corporate
                networks.
              </p>
            </div>
            <div className="mt-3 text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Read policy
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              MDM Acknowledgement
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                This policy descibes use of personal devices on company
                networks.
              </p>
            </div>
            <div className="mt-3 text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Read policy
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-row justify-center">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </EmployeeOnboardingLayout>
  );
}
