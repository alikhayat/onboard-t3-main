import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

const timeline = [
  {
    id: 1,
    content: "Start onboarding",
    target: "John Smith",

    date: "Sep 20",
    datetime: "2020-09-20",
    icon: UserIcon,
    iconBackground: "bg-gray-400",
  },
  {
    id: 2,
    content: "Complete onboarding",
    target: "Bethany Blake",

    date: "Sep 22",
    datetime: "2020-09-22",
    icon: UserIcon,
    iconBackground: "bg-gray-400",
  },
  {
    id: 3,
    content: "Offboard",
    target: "Matt Gardner",

    date: "Sep 28",
    datetime: "2020-09-28",
    icon: NoSymbolIcon,
    iconBackground: "bg-red-500",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UpcomingFeed() {
  return (
    <div className="flow-root">
      <h3 className="mb-8 text-lg font-medium leading-6 text-gray-900">
        Upcoming
      </h3>
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
  );
}
