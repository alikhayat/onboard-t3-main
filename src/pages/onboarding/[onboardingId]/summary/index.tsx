import {
  UserIcon,
  HandThumbUpIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import ProgressBar from "../../../../components/ProgressBar";
import CustomerLayout from "../../../../layouts/CustomerLayout";
import classNames from "../../../../utils/class-name";

export default function Summary() {
  const router = useRouter();
  const { onboardingId } = router.query;
  function handleNext() {
    router.push(`/onboarding/${onboardingId}/complete`);
  }

  const timeline = [
    {
      id: 1,
      content: "Applied to",
      target: "Front End Developer",

      date: "Sep 20",
      datetime: "2020-09-20",
      icon: UserIcon,
      iconBackground: "bg-gray-400",
    },
    {
      id: 2,
      content: "Advanced to phone screening by",
      target: "Bethany Blake",

      date: "Sep 22",
      datetime: "2020-09-22",
      icon: HandThumbUpIcon,
      iconBackground: "bg-blue-500",
    },
    {
      id: 3,
      content: "Completed phone screening with",
      target: "Martha Gardner",

      date: "Sep 28",
      datetime: "2020-09-28",
      icon: CheckIcon,
      iconBackground: "bg-green-500",
    },
    {
      id: 4,
      content: "Advanced to interview by",
      target: "Bethany Blake",

      date: "Sep 30",
      datetime: "2020-09-30",
      icon: HandThumbUpIcon,
      iconBackground: "bg-blue-500",
    },
    {
      id: 5,
      content: "Completed interview with",
      target: "Katherine Snyder",

      date: "Oct 4",
      datetime: "2020-10-04",
      icon: CheckIcon,
      iconBackground: "bg-green-500",
    },
  ];
  return (
    <CustomerLayout title="Onboarding">
      <>
        <div>
          {/* Progress bar plase */}
          <ProgressBar stepIndex={2} />
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-1 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Summary
                </h3>
                <p className="text-no-wrap mt-1 text-sm text-gray-600">
                  The following actions will be taken on January 1
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="mt-8">Setup</p>

            <div className="mt-6 mb-8 flow-root">
              <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== timeline.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={classNames(
                              event.iconBackground,
                              "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                            )}
                          >
                            <event.icon
                              className="h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.content}{" "}
                              <a className="font-medium text-gray-900">
                                {event.target}
                              </a>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={event.datetime}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleNext()}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Complete
            </button>
          </div>
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
