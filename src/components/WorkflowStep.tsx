import { Menu, Transition } from "@headlessui/react";
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import cuid from "cuid";
import { Fragment, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import classNames from "../utils/class-name";
import { trpc } from "../utils/trpc";
import { WorkflowStep } from "./Workflow";

interface WorkflowStepProps {
  workflowStep: WorkflowStep;
  color: string;
  optionalWorkflow: boolean;
}

export function WorkflowStep(props: WorkflowStepProps) {
  // const {
  //   data: expansion,
  //   isSuccess: expansionFetchingSuccess,
  //   isLoading: expansionLoading,
  // } = trpc.workflow.getWorkflowStepAlignment.useQuery({
  //   workflowOption: props.optionalWorkflow,
  //   workflowStepType: props.workflowStep.workflowStepType,
  // });

  const [workflowItems, setWorkflowItems] = useState(
    props?.workflowStep?.items
  );

  // useEffect(() => {
  //   if (expansionFetchingSuccess && expansion) {
  //     //  setWorkflowItems([...props?.workflowStep?.items, ...expansion]);
  //   }
  // }, [expansion]);

  const utils = trpc.useContext();

  const { mutate, isLoading } =
    trpc.workflow.associateWorkItemWithWorkflowStep.useMutation({
      onSuccess: async () => {
        //  await utils.workflow.getWorkflowStepAlignment.invalidate(); // Invalidate the query

        await utils.workflow.getCustomerWorkflow.invalidate(); // Invalidate the query
      },
    });

  const [selectedWorkflowItem, setSelectedWorkflowItem] = useState<
    string | false
  >(false);

  return (
    <>
      <h2 className="text-sm font-medium text-gray-500">
        {props.workflowStep.name}
      </h2>
      <div
        role="list"
        className="mt-3 grid grid-cols-1 gap-5"
        style={{ height: "max(" }}
      >
        <ReactSortable
          list={workflowItems}
          tag="div"
          group={props.workflowStep.workflowStepType}
          onAdd={(e) => {
            if (e.item.id) {
              mutate({
                stepId: props.workflowStep.id,
                itemId: e.item.id,
              });
            }
          }}
          filter=".required"
          setList={setWorkflowItems}
        >
          {workflowItems.length > 0 &&
            workflowItems.map((workflowItem, index) => (
              <div
                key={workflowItem?.name || cuid()}
                id={workflowItem?.id}
                className={classNames(
                  workflowItem?.required || workflowItem.name === null
                    ? "required"
                    : ""
                )}
              >
                {selectedWorkflowItem != workflowItem.id ? (
                  <div
                    onClick={() =>
                      workflowItem.name !== null &&
                      setSelectedWorkflowItem(workflowItem.id)
                    }
                    className="col-span-1 mb-4 flex h-16 rounded-md shadow-sm"
                  >
                    <div
                      className={classNames(
                        workflowItem.name !== null ? props.color : "",
                        "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md  text-sm font-medium text-white"
                      )}
                    >
                      {workflowItem?.name?.substring(0, 1)}
                    </div>
                    <div
                      className={classNames(
                        workflowItem.name !== null
                          ? "border-t border-r border-b"
                          : "",
                        "flex flex-1 items-center justify-between truncate rounded-r-md  border-gray-200 bg-white"
                      )}
                    >
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                        <a className="font-medium text-gray-900 hover:text-gray-600">
                          {workflowItem.name}{" "}
                          {workflowItem?.required && workflowItem?.name !== null
                            ? "(Required)"
                            : ""}
                        </a>
                        <p className="text-gray-500">
                          {workflowItem?.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 pr-2"></div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedWorkflowItem(workflowItem.id)}
                    key={workflowItem.id}
                    className="col-span-1 mb-4 flex rounded-md shadow-sm"
                  >
                    <div
                      className={classNames(
                        props.color,
                        "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                      )}
                    >
                      {workflowItem?.name?.substring(0, 1)}
                    </div>
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                      <div className="space-y-6 sm:space-y-5">
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            First name
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="first-name"
                              id="first-name"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Last name
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="last-name"
                              id="last-name"
                              autoComplete="family-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 pr-2"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          {/* <div key={"qwewe"} id={"qweqweqweq"}>
            <div
              onClick={() => setSelectedWorkflowItem("qweqweqweq")}
              className="col-span-1 mb-4 flex rounded-md shadow-sm"
            >
              <div
                className={classNames(
                  props.color,
                  "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                )}
              >
                {"workflowItem.name".substring(0, 1)}
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <a className="font-medium text-gray-900 hover:text-gray-600">
                    {"workflowItem.name"} {false ? "(Required)" : "(Optional)"}
                  </a>
                  <p className="text-gray-500">{"workflowItem.description"}</p>
                </div>
                <div className="flex-shrink-0 pr-2"></div>
              </div>
            </div>
          </div> */}
          {/* <div className="col-span-1 mb-4 flex rounded-md shadow-sm">
            <div
              className={classNames(
                props.color,
                "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
              )}
            >
              WFI{" "}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a className="font-medium text-gray-900 hover:text-gray-600">
                  {"Workflow item name"} {false ? "(Required)" : "(Optional)"}
                </a>
                <p className="text-gray-500">{"Description"}</p>
              </div>
              <div className="flex-shrink-0 pr-2"></div>
            </div>
          </div> */}
        </ReactSortable>
      </div>
    </>
  );
}
