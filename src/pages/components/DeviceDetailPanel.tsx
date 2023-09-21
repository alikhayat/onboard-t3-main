import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { DeviceComponent, DeviceTemplate } from "@prisma/client";
import { Fragment } from "react";
import { trpc } from "../../utils/trpc";

interface Props {
  selectedTemplate:
    | null
    | (DeviceTemplate & {
        deviceComponents: DeviceComponent[];
      })
    | undefined;
  setSelectedTemplate: (x: any) => void;
}

export default function DeviceDetailPanel(props: Props) {
  const utils = trpc.useContext();
  const deleteDeviceTemplate = trpc.device.deleteDeviceTemplate.useMutation({
    onSuccess: async () => {
      await utils.device.getAllDeviceTemplates.invalidate();
      await utils.device.getAllDeviceComponents.invalidate();
    },
  });
  const { selectedTemplate, setSelectedTemplate } = props;
  const deviceComponents = selectedTemplate
    ? selectedTemplate!.deviceComponents
    : [];
  const notes = selectedTemplate
    ? deviceComponents?.find((a) => a.label === "Notes")?.value
    : "";
  const filteredComponents = deviceComponents.filter(
    (d) => d.label != "Notes" && d.label != "Make" && d.label != "Name"
  );

  return (
    <Transition.Root show={selectedTemplate !== null} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setSelectedTemplate(null)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-96">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setSelectedTemplate(null)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-white p-8">
                    <div className="space-y-6 pb-16">
                      <div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="text-lg font-medium text-gray-900">
                              <span className="sr-only">Details for </span>
                              {selectedTemplate?.name}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">
                              {
                                selectedTemplate?.deviceComponents?.find(
                                  (d) => d.label === "Make"
                                )?.value
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Options</h3>

                        <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                          {filteredComponents.map((c) => {
                            return (
                              <div
                                key={c.id}
                                className="flex justify-between py-3 text-sm font-medium"
                              >
                                <dt className="text-gray-500">{c.label}</dt>
                                <dd className="text-gray-900">{c.value}</dd>
                              </div>
                            );
                          })}
                        </dl>
                      </div>
                      {notes && (
                        <div>
                          <h3 className="font-medium text-gray-900">Notes</h3>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm italic text-gray-500">
                              {notes ? notes : ""}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex">
                        <button
                          type="button"
                          className="ml-3 flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Edit Device
                        </button>
                        <button
                          type="button"
                          className="ml-3 flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            deleteDeviceTemplate.mutate({
                              deviceTemplateId: selectedTemplate?.id as string,
                            });
                            setSelectedTemplate(null);
                          }}
                        >
                          Delete Device
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
