import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DescriptionList from "./DescriptionList";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

interface ConsentFormProps {
  NEXTAUTH_URL?: string;
}

export default function ConsentForm({ NEXTAUTH_URL }: ConsentFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  return (
    <>
      <DescriptionList
        label="Microsoft Graph"
        description="Permissions that itOS requires from Microsoft Graph API to function properly"
        items={[
          {
            label: "Device.Read.All",
            description:
              "Allows the app to read your organization's devices' configuration information without a signed-in user.",
          },
          {
            label: "DeviceManagementManagedDevices.Read.All",
            description:
              "Allows the app to read the properties of devices managed by Microsoft Intune, without a signed-in user.",
          },
          {
            label: "Directory.Read.All",
            description:
              "Allows the app to read data in your organization's directory, such as users, groups and apps, without a signed-in user.",
          },
          {
            label: "Domain.Read.All",
            description:
              "Allows the app to read all domain properties without a signed-in user.",
          },
          {
            label: "Organization.Read.All",
            description:
              "Allows the app to read the organization and related resources, without a signed-in user. Related resources include things like subscribed skus and tenant branding information.",
          },
          {
            label: "Policy.Read.All",
            description:
              "Allows the app to read all your organization's policies without a signed in user.",
          },
          {
            label: "User.ReadWrite.All",
            description:
              "Allows the app to read and update user profiles without a signed in user.",
          },
          {
            label: "UserAuthenticationMethod.ReadWrite.All",
            description:
              "Allows the application to read and write authentication methods of all users in your organization, without a signed-in user. Authentication methods include things like a user’s phone numbers and Authenticator app settings. This does not allow the app to see secret information like passwords, or to sign-in or otherwise use the authentication methods.",
          },
        ]}
      />

      {/* <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <DescriptionList />

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <DescriptionList /> */}

      <div
        className="mt-8 cursor-pointer"
        onClick={() =>
          router.replace(
            `https://login.microsoftonline.com/${session?.user?.providerId}/adminconsent?client_id=a8f7abc0-5210-4a3b-8447-b7ae60b93b2b&state=${session?.user?.id}&redirect_uri=${NEXTAUTH_URL}/consent/callback`
          )
        }
      >
        <a className="inline-block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white shadow-md hover:bg-indigo-700">
          Proceed to consent page
        </a>
      </div>
    </>
  );
}
