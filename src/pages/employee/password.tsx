import EmployeeOnboardingLayout from "../../layouts/EmployeeOnboardingLayout";

export default function EmployeePasswordPage() {
  return (
    <EmployeeOnboardingLayout currentStep={0}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">
              First Day Onboarding
            </h2>
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Welcome to ACME Corp
            </p>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              We are excited to have you onboard. Let&apos;s set up your IT
              environment.
            </p>
          </div>
        </div>
        <div className="py-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="temp-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Temporary Password
                </label>
                <div className="mt-1">
                  <input
                    id="temp-password"
                    name="temp-password"
                    type="password"
                    autoComplete="temp-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Set a new password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password-confirm"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm your new password
                </label>
                <div className="mt-1">
                  <input
                    id="password-confirm"
                    name="password-confirm"
                    type="password"
                    autoComplete="password-confirm"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </EmployeeOnboardingLayout>
  );
}
