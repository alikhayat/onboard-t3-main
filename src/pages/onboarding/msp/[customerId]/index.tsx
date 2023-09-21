import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import type { Onboarding } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import ProgressBar from "../../../../components/ProgressBar";
import CustomerLayout from "../../../../layouts/CustomerLayout";
import { prisma } from "../../../../server/db/client";
import classNames from "../../../../utils/class-name";
import { trpc } from "../../../../utils/trpc";

interface OnboardingInfoProps {
  onboardings: Onboarding[];
}

export default function OnboardingInfo(props: OnboardingInfoProps) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { customerId } = router.query;
  const createOnboarding =
    trpc.onboarding.createOnboardingForCustomer.useMutation({
      onSuccess: async (data: any) => {
        console.log("Onboarding created");
        console.log(data);
        await utils.onboarding.invalidate();
        router.push(`/onboarding/msp/${customerId}/${data.id}/personal-info`);
      },
      onError: () => {
        console.error("Error while creating onboarding");
      },
    });
  function handleNext() {
    router.push("/onboarding/assets");
  }
  const startNewRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Onboarding | null>(null);

  const filteredPeople =
    query === ""
      ? props.onboardings
      : props.onboardings.filter((person) => {
          return person.id.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <CustomerLayout title="Onboarding">
      <Transition.Root show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={startNewRef}
          onClose={() => {
            console.log();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 h-48 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Onboarding In Draft
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You have an onboarding in draft. Do you want to
                            start a new one?
                          </p>
                        </div>
                        <Combobox
                          as="div"
                          value={selectedPerson as Onboarding}
                          onChange={(e: any) => {
                            if (e?.id) {
                              router.push(
                                `/onboarding/msp/${customerId}/${e.id}/personal-info`
                              );
                            }
                          }}
                        >
                          <Combobox.Label className="block text-sm font-medium text-gray-700">
                            Onboardings in progress
                          </Combobox.Label>
                          <div className="relative mt-1">
                            <Combobox.Input
                              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                              onChange={(event) => setQuery(event.target.value)}
                              displayValue={(person: any) => person?.id}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </Combobox.Button>

                            {filteredPeople.length > 0 && (
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredPeople.map((person) => (
                                  <Combobox.Option
                                    key={person.id}
                                    value={person}
                                    className={({ active }) =>
                                      classNames(
                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            "block truncate",
                                            selected
                                              ? "font-semibold"
                                              : "font-normal"
                                          )}
                                        >
                                          {person.id}
                                        </span>

                                        {selected && (
                                          <span
                                            className={classNames(
                                              "absolute inset-y-0 right-0 flex items-center pr-4",
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            )}
                          </div>
                        </Combobox>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      ref={startNewRef}
                      className=" inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        createOnboarding.mutate({
                          customerId: customerId as string,
                        });
                      }}
                    >
                      Start New Onboarding
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => router.back()}
                    >
                      Back
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
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
  const onboardings = await prisma.onboarding.findMany({
    where: { customerId: session?.user?.endCustomerId as string },
  });
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

  if (!onboardings || onboardings.length === 0) {
    const workflow = await prisma.workflow.findFirstOrThrow({
      where: {
        customer: { id: session?.user?.endCustomerId as string },
        workflowType: "ONBOARDING",
      },
      include: { steps: { include: { items: true } } },
    });
    const onboarding = await prisma.onboarding.create({
      data: {
        workflow: { connect: { id: workflow?.id } },
        customer: { connect: { id: session?.user?.endCustomerId as string } },
        tasks: {
          create: [
            ...(workflow.steps as any[]).reduce((p, s) => {
              p.push(
                ...(s.items as any[]).map((i) => {
                  return {
                    name: i.name,
                    stepName: s.name,
                    workflowStep: { connect: { id: s.id } },
                    workflowItem: { connect: { id: i.id } },
                  };
                })
              );
              return p;
            }, [] as any[]),
          ],
        },
      },
    });

    return {
      redirect: {
        destination: `/onboarding/${onboarding.id}/personal-info`,
        permanent: false,
      },
    };
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
    props: { onboardings: JSON.parse(JSON.stringify(onboardings)) },
  };
}
