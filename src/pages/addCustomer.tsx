import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import AuthorizedLayout from "../layouts/AuthorizedLayout";
import { trpc } from "../utils/trpc";

export default function AddCustomerPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const utils = trpc.useContext();
  const createCustomer = trpc.customer.create.useMutation({
    onSuccess: (data) => {
      utils.customer.getAll.invalidate();
    },
  });

  const onSubmit = (data: any) => {
    createCustomer.mutate({
      companyName: data["Company Name"],
      email: data["Email"],
      firstName: data["First Name"],
      lastName: data["Last Name"],
    });
    router.push("/dashboard");
  };

  return (
    <AuthorizedLayout title={"Add a New Customer"}>
      <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <div className="mt-4 sm:col-span-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company name
              </label>
              <div className="mt-1">
                <input
                  {...register("Company Name", {
                    required: true,
                    minLength: 3,
                  })}
                  id="companyName"
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    {...register("First Name", {
                      required: true,
                      minLength: 2,
                    })}
                    id="firstName"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    {...register("Last Name", {
                      required: true,
                      minLength: 2,
                    })}
                    type="text"
                    id="lastName"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    {...register("Email", {
                      required: true,
                      minLength: 3,
                      pattern: /^\S+@\S+$/i,
                    })}
                    id="email"
                    type="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </AuthorizedLayout>
  );
}
