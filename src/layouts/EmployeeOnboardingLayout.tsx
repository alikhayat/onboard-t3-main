import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

interface OnboardingProps {
  firstName?: string;
  lastName?: string;
  logoId?: string;
  children: React.ReactNode;
  currentStep: number;
}

export default function EmployeeOnboardingLayout(props: OnboardingProps) {
  const { firstName, lastName, logoId, children, currentStep } = props;

  const [open, setOpen] = useState(false);

  function getStatus(step: number) {
    if (step > currentStep) {
      return "upcoming";
    } else if (step === currentStep) {
      return "current";
    } else {
      return "complete";
    }
  }

  const steps = [
    {
      id: "1",
      name: "Password",
      href: "/employee/password",
      status: getStatus(0),
    },
    {
      id: "2",
      name: "Policies",
      href: "/employee/policies",
      status: getStatus(1),
    },
    {
      id: "3",
      name: "Security",
      href: "/employee/security",
      status: getStatus(2),
    },
    {
      id: "4",
      name: "Accounts",
      href: "/employee/accounts",
      status: getStatus(3),
    },
    {
      id: "5",
      name: "Complete",
      href: "/employee/complete",
      status: getStatus(4),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-grow flex-col">
        <nav className="m-8" aria-label="Progress">
          <ol
            role="list"
            className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
          >
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative md:flex md:flex-1">
                {step.status === "complete" ? (
                  <a
                    href={step.href}
                    className="group flex w-full items-center"
                  >
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                        <CheckIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </a>
                ) : step.status === "current" ? (
                  <a
                    href={step.href}
                    className="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                      <span className="text-indigo-600">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-indigo-600">
                      {step.name}
                    </span>
                  </a>
                ) : (
                  <a href={step.href} className="group flex items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                        <span className="text-gray-500 group-hover:text-gray-900">
                          {step.id}
                        </span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </a>
                )}

                {stepIdx !== steps.length - 1 ? (
                  <>
                    {/* Arrow separator for lg screens and up */}
                    <div
                      className="absolute top-0 right-0 hidden h-full w-5 md:block"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-full w-full text-gray-300"
                        viewBox="0 0 22 80"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 -2L20 40L0 82"
                          vectorEffect="non-scaling-stroke"
                          stroke="currentcolor"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
        <div className="flex-1 flex-grow py-10">
          <main>
            <div className="mx-auto max-w-7xl  px-6 lg:px-8">{children}</div>
          </main>
        </div>
        <div className="my-4 flex w-full flex-row justify-center md:justify-end">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:mr-6"
          >
            <QuestionMarkCircleIcon
              className="-ml-0.5 mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Get Help
          </button>
        </div>
        <footer className="bg-white">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="md:mt-0">
              <p className="text-center text-base text-gray-400">
                &copy; 2022 itOS. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="bg-white">
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
                                        <dt className="sr-only">
                                          Phone number
                                        </dt>
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
                                        <dt className="sr-only">
                                          Phone number
                                        </dt>
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
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
