import EmployeeOnboardingLayout from "../../layouts/EmployeeOnboardingLayout";

export default function EmployeeSecurityPage() {
  return (
    <EmployeeOnboardingLayout currentStep={2}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">
              First Day Onboarding
            </h2>
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Cybersecurity Training
            </p>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              At ACME Corp we take security seriously. We believe that security
              starts with each one of us.
            </p>
          </div>
        </div>
        <div className="mt-8 flex w-full justify-center">
          <div>
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/PlHnamdwGmw"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
