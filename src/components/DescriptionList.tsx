import { PaperClipIcon } from "@heroicons/react/20/solid";

export interface DescriptionListItem {
  label: string;
  description: string;
}

export interface ConsentCategory {
  label: string;
  description: string;
  items: DescriptionListItem[];
}

const DescriptionItem = (props: DescriptionListItem, index: number) => {
  return index % 2 == 0 ? (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{props.label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {props.description}
      </dd>
    </div>
  ) : (
    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{props.label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {props.description}
      </dd>
    </div>
  );
};

export default function DescriptionList(props: ConsentCategory) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {props.label}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {props.description}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {props?.items?.map((item, index) => DescriptionItem(item, index))}
        </dl>
      </div>
    </div>
  );
}
