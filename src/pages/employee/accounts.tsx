import {
  BanknotesIcon,
  ClipboardDocumentIcon,
  CreditCardIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import EmployeeOnboardingLayout from "../../layouts/EmployeeOnboardingLayout";

const actions = [
  {
    title: "HubSpot",
    href: "#",
    icon: BuildingOffice2Icon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
      "ACME Corp uses HubSpot for CRM and Marketing automation. Click here to set your password and view your training video.",
  },
  {
    title: "Quickbooks",
    description: "ACME Corp uses Quickbooks for accounting.",
    href: "#",
    icon: BanknotesIcon,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
  },
  {
    title: "Jira",
    description: "Acme Corp uses Jira for Project Management.",
    href: "#",
    icon: ClipboardDocumentIcon,
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
  },
  {
    title: "Expensify",
    description: "We use Expensify to track spending and reimbursements.",
    href: "#",
    icon: CreditCardIcon,
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export default function EmployeeAccountsPage() {
  return (
    <EmployeeOnboardingLayout currentStep={3}>
      <div className="mx-auto mb-8 max-w-7xl px-4  sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-indigo-600">
            First Day Onboarding
          </h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Account Setup
          </p>
          <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
            Click on the tiles below to set up your new software accounts.
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {actions.map((action, actionIdx) => (
          <div
            key={action.title}
            className={classNames(
              actionIdx === 0
                ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                : "",
              actionIdx === 1 ? "sm:rounded-tr-lg" : "",
              actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
              actionIdx === actions.length - 1
                ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                : "",
              "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBackground,
                  action.iconForeground,
                  "inline-flex rounded-lg p-3 ring-4 ring-white"
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <a href={action.href} className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">{action.description}</p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-row justify-center">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </EmployeeOnboardingLayout>
  );
}
