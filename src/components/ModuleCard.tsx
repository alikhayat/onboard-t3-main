interface ModuleCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonOnClick: () => void;
}

export default function ModuleCard(props: ModuleCardProps) {
  return (
    <div className="my-6 rounded border border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {props.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{props.description}</p>
        </div>
        <div className="ml-4 mt-4 flex-shrink-0">
          <button
            type="button"
            onClick={props.buttonOnClick}
            className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {props.buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
