import EmployeeOnboardingLayout from "../../layouts/EmployeeOnboardingLayout";

export default function EmployeeCompletePage() {
  return (
    <EmployeeOnboardingLayout currentStep={5}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">
              First Day Onboarding
            </h2>
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Thank you!
            </p>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              You have completed all onboarding steps. You can close this page.
              If you need help, please contact support.
            </p>
          </div>
          <div className="mt-8 bg-white p-4 shadow sm:rounded-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:py-24 lg:px-8">
              <div className="divide-y-2 divide-gray-200">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
                    IT Help
                  </h2>
                  <div className="mt-8 grid grid-cols-1 gap-12 lg:col-span-2 lg:mt-0">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Edge Networks
                      </h3>
                      <dl className="mt-2 text-base text-gray-500">
                        <div>
                          <dt className="sr-only">Email</dt>
                          <dd>it@edgenetworks.us</dd>
                        </div>
                        <div className="mt-1">
                          <dt className="sr-only">Phone number</dt>
                          <dd>(360) 450-0033</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="mt-16 pt-16 lg:grid lg:grid-cols-2 lg:gap-8">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
                    Human Resources
                  </h2>
                  <div className="mt-8 grid grid-cols-1 gap-12 lg:col-span-2 lg:mt-0">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Acme LLC
                      </h3>
                      <h3 className="text-lg font-light leading-6 text-gray-900">
                        Angela Abel, Hiring Manager
                      </h3>
                      <dl className="mt-2 text-base text-gray-500">
                        <div>
                          <dt className="sr-only">Email</dt>
                          <dd>HR@acmecorp.co.nz</dd>
                        </div>
                        <div className="mt-1">
                          <dt className="sr-only">Phone number</dt>
                          <dd>(360) 555-5555</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeOnboardingLayout>
  );
}
