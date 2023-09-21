import {
  ArrowRightCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { DeviceComponent } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthorizedLayout from "../../../../layouts/AuthorizedLayout";
import { trpc } from "../../../../utils/trpc";

interface Field {
  id: string;
  label: string;
  placeholder?: string;
}

const deviceTypes = [
  { id: "laptop", title: "Laptop" },
  { id: "desktop", title: "Desktop" },
  { id: "phone", title: "Mobile Phone" },
  { id: "tablet", title: "Tablet" },
  { id: "other", title: "Other" },
];

interface templateDto {
  name: string;
  type: string;
  deviceComponents: DeviceComponent[];
  customerId: string;
}

const laptopFields = [
  { id: "make", label: "Make and Model", placeholder: "Apple MacBook Pro" },
  { id: "CPU", label: "Processor", placeholder: "M1" },
  { id: "RAM", label: "RAM", placeholder: "16 Gb" },
  { id: "storage", label: "Storage", placeholder: "256 Gb SSD" },
  { id: "screen", label: "Screen Size", placeholder: `16"` },
];

const desktopFields = [
  { id: "make", label: "Make and Model", placeholder: "Intel Optima RX9000" },
  { id: "CPU", label: "Processor", placeholder: "Celeron 320" },
  { id: "RAM", label: "RAM", placeholder: "1 Gb" },
  { id: "storage", label: "Storage", placeholder: "128 Gb HDD" },
  { id: "monitor", label: "Monitor Option", placeholder: "Ultrawide" },
  { id: "keyboard", label: "Keyboard Option", placeholder: "Microsoft Sculpt" },
  { id: "mouse", label: "Mouse Option", placeholder: "Logitech Pro" },
];

const phoneFields = [
  { id: "make", label: "Make and Model", placeholder: "Google Pixel 3" },
  { id: "storage", label: "Storage", placeholder: "256 Gb" },
];

const tabletFields = [
  { id: "make", label: "Make and Model", placeholder: "Apple iPad" },
  { id: "storage", label: "Storage", placeholder: "256 Gb" },
];

export default function MspTemplateBuilderPage() {
  const router = useRouter();
  const mspCreateDeviceTemplate =
    trpc.device.mspCreateDeviceTemplate.useMutation();
  const { customerId } = router.query;
  const {
    register,
    resetField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [customFields, setCustomFields] = useState<Field[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const watchCustom = watch("Custom Value");

  function getId(id: string) {
    if (id.length === 0) {
      return false;
    }
    const idArray = id.split(" ");
    // eslint-disable-next-line prefer-const
    let newArray = [];

    for (let i = 0; i < idArray.length; i++) {
      let char;
      if (i === 0) {
        char = idArray[i]?.charAt(0).toLowerCase();
      } else {
        char = idArray[i]?.charAt(0).toUpperCase();
      }

      if (!idArray[i]) {
        return newArray.join("");
      }
      const arr = idArray[i]!.split("");
      const first = arr.shift();
      const transformedArray = arr?.unshift(char!);
      newArray.push(arr.join(""));
    }
    return newArray.join("");
  }

  function handleAddField() {
    if (customFields.some((obj) => obj.label === watchCustom)) {
      return false;
    }
    if (watchCustom.length < 3) {
      return false;
    }
    const idValue = getId(watchCustom as string);
    if (idValue) {
      setCustomFields([...customFields, { id: idValue, label: watchCustom }]);
      resetField("Custom Value");
    }
  }

  function handleRemoveField(id: string) {
    setCustomFields((field: Field[]) => {
      return field.filter((a) => a.id !== id);
    });
  }

  function handleCreateTemplate(data: any) {
    // eslint-disable-next-line prefer-const
    let deviceComponents: DeviceComponent[] = [];
    Object.keys(data).map((a: string) => {
      if (a !== "Custom Value" && a !== "Template Name" && data[a].length > 0) {
        deviceComponents.push({
          label: a.charAt(0).toUpperCase() + a.substring(1),
          value: data[a],
        } as DeviceComponent);
      }
    });
    const config: templateDto = {
      name: data["Template Name"],
      type: selectedType as string,
      deviceComponents: deviceComponents,
      customerId: customerId as string,
    };
    mspCreateDeviceTemplate.mutate(config);
    router.push(`/devices/manage-options/${customerId}`);
  }

  return (
    <AuthorizedLayout title="Add a device">
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Basic Device Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Let&apos;s start with some basic information we need to get
                started.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div>
                  <label
                    htmlFor="template-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Device Name
                  </label>
                  <p className="text-sm leading-5 text-gray-500">
                    Enter your nickname for this configuration. We&apos;ll set
                    make, model, and configurations later.
                  </p>
                  <div className="mt-1">
                    <input
                      {...register("Template Name", {
                        required: true,
                        minLength: 1,
                      })}
                      type="text"
                      id="template-name"
                      placeholder="e.g. Standard Windows Laptop"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Device Type
                  </label>
                  <p className="text-sm leading-5 text-gray-500">
                    What type of device is this?
                  </p>
                  <fieldset className="mt-4">
                    <legend className="sr-only">Notification method</legend>
                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      {deviceTypes.map((deviceType) => (
                        <div key={deviceType.id} className="flex items-center">
                          <input
                            id={deviceType.id}
                            name="notification-method"
                            onChange={() => setSelectedType(deviceType.id)}
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={deviceType.id}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {deviceType.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Configuration Options
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Enter your configuration choices for this device.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                {selectedType === null && (
                  <p className="text-sm font-medium text-gray-700">
                    Select a device type to get started
                  </p>
                )}
                {selectedType === "laptop" && (
                  <div className="grid grid-cols-6 gap-6">
                    {laptopFields.map((field) => {
                      return (
                        <div
                          key={field.id}
                          className="col-span-6 sm:col-span-6 lg:col-span-2"
                        >
                          <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.label}
                          </label>
                          <input
                            {...register(`${field.id}`, {
                              required: true,
                              minLength: 1,
                            })}
                            type="text"
                            name={field.id}
                            id={field.id}
                            placeholder={field.placeholder}
                            autoComplete="address-level2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      );
                    })}
                    {customFields.length > 0 &&
                      customFields.map((field: any) => {
                        return (
                          <div
                            key={field.id}
                            className="col-span-6 sm:col-span-6 lg:col-span-2"
                          >
                            <div className="flex flex-row items-center">
                              <button
                                className="mr-2 h-4 w-4"
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <MinusCircleIcon color="red" />
                              </button>
                              <label
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {field.label}
                              </label>
                            </div>

                            <input
                              {...register(`${field.id}`, {
                                required: true,
                                minLength: 1,
                              })}
                              type="text"
                              id={field.id}
                              autoComplete="address-level2"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
                {selectedType === "desktop" && (
                  <div className="grid grid-cols-6 gap-6">
                    {desktopFields.map((field) => {
                      return (
                        <div
                          key={field.id}
                          className="col-span-6 sm:col-span-6 lg:col-span-2"
                        >
                          <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.label}
                          </label>
                          <input
                            {...register(`${field.id}`, {
                              required: true,
                              minLength: 1,
                            })}
                            type="text"
                            name={field.id}
                            id={field.id}
                            placeholder={field.placeholder}
                            autoComplete="address-level2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      );
                    })}
                    {customFields.length > 0 &&
                      customFields.map((field: any) => {
                        return (
                          <div
                            key={field.id}
                            className="col-span-6 sm:col-span-6 lg:col-span-2"
                          >
                            <div className="flex flex-row items-center">
                              <button
                                className="mr-2 h-4 w-4"
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <MinusCircleIcon color="red" />
                              </button>
                              <label
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {field.label}
                              </label>
                            </div>

                            <input
                              {...register(`${field.id}`, {
                                required: true,
                                minLength: 1,
                              })}
                              type="text"
                              name={field.id}
                              id={field.id}
                              autoComplete="address-level2"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
                {selectedType === "phone" && (
                  <div className="grid grid-cols-6 gap-6">
                    {phoneFields.map((field) => {
                      return (
                        <div
                          key={field.id}
                          className="col-span-6 sm:col-span-6 lg:col-span-2"
                        >
                          <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.label}
                          </label>
                          <input
                            {...register(`${field.id}`, {
                              required: true,
                              minLength: 1,
                            })}
                            type="text"
                            name={field.id}
                            id={field.id}
                            placeholder={field.placeholder}
                            autoComplete="address-level2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      );
                    })}
                    {customFields.length > 0 &&
                      customFields.map((field: any) => {
                        return (
                          <div
                            key={field.id}
                            className="col-span-6 sm:col-span-6 lg:col-span-2"
                          >
                            <div className="flex flex-row items-center">
                              <button
                                className="mr-2 h-4 w-4"
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <MinusCircleIcon color="red" />
                              </button>
                              <label
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {field.label}
                              </label>
                            </div>

                            <input
                              {...register(`${field.id}`, {
                                required: true,
                                minLength: 1,
                              })}
                              type="text"
                              name={field.id}
                              id={field.id}
                              autoComplete="address-level2"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
                {selectedType === "tablet" && (
                  <div className="grid grid-cols-6 gap-6">
                    {tabletFields.map((field) => {
                      return (
                        <div
                          key={field.id}
                          className="col-span-6 sm:col-span-6 lg:col-span-2"
                        >
                          <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.label}
                          </label>
                          <input
                            {...register(`${field.id}`, {
                              required: true,
                              minLength: 1,
                            })}
                            type="text"
                            name={field.id}
                            id={field.id}
                            placeholder={field.placeholder}
                            autoComplete="address-level2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      );
                    })}
                    {customFields.length > 0 &&
                      customFields.map((field: any) => {
                        return (
                          <div
                            key={field.id}
                            className="col-span-6 sm:col-span-6 lg:col-span-2"
                          >
                            <div className="flex flex-row items-center">
                              <button
                                className="mr-2 h-4 w-4"
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <MinusCircleIcon color="red" />
                              </button>
                              <label
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {field.label}
                              </label>
                            </div>

                            <input
                              {...register(`${field.id}`, {
                                required: true,
                                minLength: 1,
                              })}
                              type="text"
                              name={field.id}
                              id={field.id}
                              autoComplete="address-level2"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
                {selectedType === "other" && (
                  <div className="grid grid-cols-6 gap-6">
                    {" "}
                    {customFields.length > 0 &&
                      customFields.map((field: any) => {
                        return (
                          <div
                            key={field.id}
                            className="col-span-6 sm:col-span-6 lg:col-span-2"
                          >
                            <div className="flex flex-row items-center">
                              <button
                                className="mr-2 h-4 w-4"
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <MinusCircleIcon color="red" />
                              </button>
                              <label
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {field.label}
                              </label>
                            </div>

                            <input
                              {...register(`${field.name}`, {
                                required: true,
                                minLength: 1,
                              })}
                              type="text"
                              id={field.id}
                              autoComplete="address-level2"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
                {selectedType !== null && (
                  <div className="mt-16 md:w-1/2">
                    <label
                      htmlFor="custom"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Add a custom field
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <PlusCircleIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="text"
                          id="custom"
                          {...register("Custom Value", {})}
                          className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder={
                            customFields.length === 0 ? "Color" : undefined
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddField()}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <ArrowRightCircleIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Notes
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Enter any special ordering or setup notes that go with this
                device configuration.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="mt-1">
                <textarea
                  {...register("notes")}
                  id="notes"
                  name="notes"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <p>Summary</p>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(handleCreateTemplate)}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Save device configuration
        </button>
      </div>
    </AuthorizedLayout>
  );
}
