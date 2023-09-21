import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import { ChartBarIcon, UsersIcon } from "@heroicons/react/24/outline";

export interface EndCustomerStatsType {
  numberOfPeople: number;
  numberOfOnboardings: number;
  avgOnboardingProgress: number;
}

interface StatsProps {
  values: EndCustomerStatsType;
}

export default function CustomerStats(props: StatsProps) {
  const stats = [
    {
      id: 1,
      name: "Number of Employees",
      stat: props?.values?.numberOfPeople
        ? props?.values?.numberOfPeople.toString() + " people"
        : "0 people",
      icon: UsersIcon,
    },
    {
      id: 2,
      name: "Number currently onboarding",
      stat: props?.values?.numberOfOnboardings
        ? props?.values?.numberOfOnboardings.toString() + " people"
        : "0 people",
      icon: ArrowRightCircleIcon,
    },
    {
      id: 3,
      name: "Average Completion",
      stat: props?.values?.avgOnboardingProgress
        ? props?.values?.avgOnboardingProgress.toString() + "% completed"
        : "0% completed",
      icon: ChartBarIcon,
    },
  ];
  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Last 30 days
      </h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>

              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500">
                    {" "}
                    View all<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
