import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ArrowRightCircleIcon,
  AdjustmentsHorizontalIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import CompanySelector from "../components/CompanySelector";
import NotificationIcon from "../components/NotificationIcon";
import SearchIcon from "../components/SearchIcon";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, path: "/dashboard/msp" },
  {
    name: "Onboarding",
    icon: ArrowRightCircleIcon,

    path: "/onboarding/msp",
  },

  { name: "People", icon: UsersIcon, path: "/people/msp" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AuthorizedLayout(props: Props) {
  const { children, title } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Image
                        className="h-16 w-auto"
                        width={64}
                        height={64}
                        src="/img/itos-logo.svg"
                        alt="Your Company"
                      />
                    </div>

                    <nav className="mt-5 space-y-1 px-2">
                      <div className="m-2">
                        <CompanySelector />
                      </div>
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          onClick={() => router.push(item.path)}
                          className={classNames(
                            item.path === router.pathname
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.path === router.pathname
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                    <div className="group block flex-grow">
                      <div className="flex items-center ">
                        <div>
                          <Image
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                            height={32}
                            width={32}
                          />
                        </div>
                        <div className="ml-3 flex-grow">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            Vlad Bazyliak
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            View profile
                          </p>
                        </div>
                        <div>
                          <ArrowRightOnRectangleIcon
                            title="Sign out"
                            name="Sign out"
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="cursor-pointer text-gray-500"
                            height={32}
                            width={32}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex flex-shrink-0 items-center px-4">
                <Image
                  className="h-16 w-auto"
                  src="/img/itos-logo.svg"
                  alt="Your Company"
                  height={64}
                  width={64}
                />
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                <div className="m-2">
                  <CompanySelector />
                </div>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={classNames(
                      router.pathname.startsWith(item.path)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.path === router.pathname
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <div className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <Image
                      className="inline-block h-9 w-9 rounded-full"
                      src={session?.user?.image || "/img/avatar.png"}
                      alt=""
                      height={32}
                      width={32}
                    />
                  </div>
                  <div className="ml-3 flex-grow ">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p
                      onClick={() => router.push("account")}
                      className="cursor-pointer text-xs font-medium text-gray-500 group-hover:text-gray-700"
                    >
                      View profile
                    </p>
                  </div>
                  <div>
                    <ArrowRightOnRectangleIcon
                      title="Sign out"
                      name="Sign out"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-gray-500"
                      height={32}
                      width={32}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto flex max-w-7xl flex-row justify-between px-4 pb-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {title}
                </h1>
                <div className="flex flex-row">
                  <div className="mr-2">
                    <NotificationIcon />
                  </div>
                  <SearchIcon />
                </div>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
