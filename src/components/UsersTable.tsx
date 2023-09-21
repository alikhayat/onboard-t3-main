import { User } from "@prisma/client";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    department: "Optimization",
    email: "lindsay.walton@example.com",
    role: "Member",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More people...
];

interface UserTableProps {
  users: User[];
  isMSPCustomerView?: boolean;
  customerId?: string;
}

export default function UserTable(props: UserTableProps) {
  const router = useRouter();
  return (
    <div className="px-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {props.users?.map((person) => (
                    <tr
                      key={person.email}
                      className="cursor-pointer"
                      onClick={() => {
                        if (!props.customerId) {
                          router.push(`/people/msp/details/${person.id}`);
                        } else {
                          if (props.isMSPCustomerView) {
                            router.push(
                              `/people/${props.customerId}/details/${person.id}`
                            );
                          } else {
                            router.push(`/people/details/${person.id}`);
                          }
                        }
                      }}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={person.image || "/img/avatar.png"}
                              alt=""
                              height={40}
                              width={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {person.name}
                            </div>
                            <div className="text-gray-500">{person.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="text-gray-900">{person.jobTitle}</div>
                        <div className="text-gray-500">{person.department}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
