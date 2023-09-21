import {
  ChevronRightIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { DeviceComponent, DeviceTemplate } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CustomerLayout from "../../../layouts/CustomerLayout";
import { trpc } from "../../../utils/trpc";
import DeviceDetailPanel from "../../components/DeviceDetailPanel";

function getIcon(type: string) {
  switch (type) {
    case "phone":
      return <DevicePhoneMobileIcon />;
    case "laptop":
      return <ComputerDesktopIcon />;
    case "desktop":
      return <ComputerDesktopIcon />;
    case "tablet":
      return <DeviceTabletIcon />;
    default:
      return <SparklesIcon />;
  }
}

export default function TemplateTablePage() {
  const router = useRouter();
  const devices = trpc.device.getAllDeviceTemplates.useQuery().data;
  const [selectedTemplate, setSelectedTemplate] = useState<
    | (DeviceTemplate & {
        deviceComponents: DeviceComponent[];
      })
    | null
    | undefined
  >(null);
  const labelText = devices?.map((d) => {
    return {
      id: d.id,
      name: d.name,
      type: d.deviceType.charAt(0).toUpperCase() + d.deviceType.substring(1),
      icon: getIcon(d.deviceType),
      description: d.deviceComponents.find((a) => a.label === "Make")?.value,
    };
  });

  return (
    <CustomerLayout title={"Device Options"}>
      <DeviceDetailPanel
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Manage your device options
            </p>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              Click on a device to view details or add a new device option
            </p>
          </div>
        </div>
      </div>
      {devices && devices.length === 0 && (
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No devices to display
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first device and configuration
          </p>
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-32">
        <div className="container mx-auto overflow-hidden bg-white px-4 shadow sm:rounded-md sm:px-6 lg:px-8">
          <ul role="list" className="divide-y divide-gray-200">
            {labelText?.map((device, i) => {
              return (
                <li
                  onClick={() => {
                    if (!devices) {
                      setSelectedTemplate(null);
                    } else {
                      setSelectedTemplate(
                        devices.find((d) => d.id === device.id)
                      );
                    }
                  }}
                  key={device.id}
                >
                  <a className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="flex min-w-0 flex-1 items-center">
                        <div className="h-6 w-6 rounded-full">
                          {device.icon}
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="truncate text-sm font-medium text-indigo-600">
                              {device.name}
                            </p>
                          </div>
                          <div className="hidden  md:block">
                            <div className="flex flex-row items-center justify-between">
                              <p className="text-sm text-gray-900">
                                {device.type}
                              </p>
                              <p className="ml-4 text-sm text-gray-500">
                                {device.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="text-center">
          <div className="mt-6">
            <button
              onClick={() => {
                router.push("/devices/new");
              }}
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add
            </button>
          </div>
        </div>
      </div>
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
