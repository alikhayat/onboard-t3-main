import { useState } from "react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CompanySelector() {
  const router = useRouter();

  function handleAddCustomerClick() {
    router.push("/addCustomer");
  }

  const getCustomers = trpc.customer.getAll.useQuery();

  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");

  const filteredCustomers =
    query === ""
      ? getCustomers.data
      : getCustomers.data?.filter((person: any) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  function handleCustomerSelectClick(id: string) {
    router.push(`/dashboard/msp/${id}`);
  }

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
      {/* <Combobox.Label className="block text-sm font-medium text-indigo-300">
        Current company:
      </Combobox.Label> */}
      <div className="relative mt-1">
        <Combobox.Input
          placeholder="Select a customer"
          className="mr-4 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person: any) => person?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            onClick={() => setQuery("")}
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredCustomers?.map((customer: any) => (
            <Combobox.Option
              onClick={() => handleCustomerSelectClick(customer.id)}
              key={customer.id}
              value={customer}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <div className="flex items-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                      <span className="text-sm font-medium leading-none text-white">
                        {customer.name.at(0)}
                      </span>
                    </span>

                    <span
                      className={classNames(
                        "ml-3 truncate",
                        selected ? "font-semibold" : ""
                      )}
                    >
                      {customer.name} {!customer?.isActivated && "(NA)"}
                    </span>
                  </div>

                  {selected && (
                    <span
                      className={classNames(
                        "absolute inset-y-0 right-0 flex items-center pr-4",
                        active ? "text-white" : "text-indigo-600"
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}

          <Combobox.Option
            key={"new"}
            value={2}
            onClick={() => handleAddCustomerClick()}
            className={({ active }) =>
              classNames(
                "relative cursor-default select-none py-2 pl-3 pr-9",
                active ? "bg-indigo-600 text-white" : "text-gray-900"
              )
            }
          >
            {({ active, selected }) => (
              <>
                <div className="flex items-center">
                  <PlusCircleIcon
                    height={32}
                    width={32}
                    className="h-6 w-6 flex-shrink-0 rounded-full"
                  />
                  <span
                    className={classNames(
                      "ml-3 truncate",
                      selected ? "font-semibold" : ""
                    )}
                  >
                    Add a new customer
                  </span>
                </div>
                {selected && (
                  <span
                    className={classNames(
                      "absolute inset-y-0 right-0 flex items-center pr-4",
                      active ? "text-white" : "text-indigo-600"
                    )}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
