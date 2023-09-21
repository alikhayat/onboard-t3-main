import { Switch } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import ProgressBar from "../../../../../../components/ProgressBar";
import CustomerLayout from "../../../../../../layouts/CustomerLayout";
import { trpc } from "../../../../../../utils/trpc";

export default function OnboardingAssets() {
  const router = useRouter();
  const { onboardingId, customerId } = router.query;

  function handleNext() {
    router.push(`/onboarding/msp/${customerId}/${onboardingId}/summary`);
  }

  const software = trpc.workflow.getSoftwareStep.useQuery();

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const [enabled, setEnabled] = useState(false);
  return (
    <CustomerLayout title="Onboarding">
      <>
        <div>
          <ProgressBar stepIndex={1} />
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Hardware Assets
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Please select the equipment needed for John
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <Switch.Group as="div" className="flex items-center">
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={classNames(
                    enabled ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      enabled ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
                <Switch.Label as="span" className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    John needs a new workstation
                  </span>
                </Switch.Label>
              </Switch.Group>
              {enabled ? (
                <p className="mt-2 text-sm text-gray-600">
                  John will be provided with a new workstation.
                </p>
              ) : (
                <form className="mt-4" action="#" method="POST">
                  <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="bg-white px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label className="text-base font-medium text-gray-900">
                            Existing Workstation
                          </label>
                          <fieldset className="mt-4">
                            <legend className="sr-only">
                              Existing workstation form
                            </legend>
                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                              <div key="laptop" className="flex items-center">
                                <input
                                  id="laptop"
                                  name="notification-method"
                                  type="radio"
                                  defaultChecked
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor="laptop"
                                  className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                  Laptop
                                </label>
                              </div>
                              <div key="desktop" className="flex items-center">
                                <input
                                  id="desktop"
                                  name="notification-method"
                                  type="radio"
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor="desktop"
                                  className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                  Desktop
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="model-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Model Name
                          </label>
                          <input
                            type="text"
                            name="model-name"
                            id="model-name"
                            autoComplete="model-name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="service-tag-number"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Service Tag Number
                          </label>
                          <input
                            type="text"
                            name="service-tag-number"
                            id="service-tag-number"
                            autoComplete="service-tag-number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="m-4"> </div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Software Applications
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Select the applications that John will need
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <fieldset className="space-y-5">
                <legend className="sr-only">Software</legend>
                {software?.data?.items?.map((item) => (
                  <div key={item.name} className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="Chrome"
                        name="Chrome"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="Chrome"
                        className="font-medium text-gray-700"
                      >
                        {item.name}
                      </label>
                    </div>
                  </div>
                ))}
              </fieldset>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleNext()}
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </CustomerLayout>
  );
}
