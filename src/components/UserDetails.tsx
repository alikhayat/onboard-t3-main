/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { User } from "@prisma/client";
import Image from "next/image";

interface UserDetailsProps {
  user: User;
}

export default function UserDetails(props: UserDetailsProps) {
  return (
    <>
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Image
                    className="h-16 w-16 rounded-full"
                    src={props?.user?.image || "/img/avatar.png"}
                    alt=""
                    height={64}
                    width={64}
                  />
                  <span
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {props?.user?.name}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  {props?.user?.jobTitle}{" "}
                  {props?.user?.jobTitle && props?.user?.email && " | "}
                  {props?.user?.email}
                </p>
              </div>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Update Profile
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Offboard Employee
              </button>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense ">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Description list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Assets Information
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Information about hardware, software and SaaS assigned.
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Hardware
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-green-800">
                              {'MacBook Pro 16" 2019'}
                            </span>
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Software
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="mx-1 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-green-800">
                              VS Code
                            </span>
                            <span className="mx-1 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-green-800">
                              Postman
                            </span>
                            <span className="mx-1 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-green-800">
                              Firefox
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
