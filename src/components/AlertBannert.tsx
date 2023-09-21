import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

interface AlertBannerProps {
  title: string;
  type: AlertBannerType;
}

export enum AlertBannerType {
  Error,
  Warning,
  Info,
  Success,
}

export default function AlertBanner(props: AlertBannerProps) {
  if (props.type === AlertBannerType.Error) {
    return (
      <div className="mt-4 mb-4 rounded-md bg-red-50 p-4 ">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-brown-800 text-sm font-medium">
              Attention needed
            </h3>
            <div className="text-brown-700 mt-2 text-sm">
              <p>{props.title}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (props.type === AlertBannerType.Warning) {
    return (
      <div className="mt-4 mb-4 rounded-md bg-yellow-50 p-4 ">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-brown-800 text-sm font-medium">
              Attention needed
            </h3>
            <div className="text-brown-700 mt-2 text-sm">
              <p>{props.title}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (props.type === AlertBannerType.Success) {
    return (
      <div className="mt-4 mb-4 rounded-md bg-green-50 p-4 ">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-brown-800 text-sm font-medium">
              Attention needed
            </h3>
            <div className="text-brown-700 mt-2 text-sm">
              <p>{props.title}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 mb-4 rounded-md bg-blue-50 p-4 ">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-brown-800 text-sm font-medium">
            Attention needed
          </h3>
          <div className="text-brown-700 mt-2 text-sm">
            <p>{props.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
