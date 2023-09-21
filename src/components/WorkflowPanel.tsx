import { HomeIcon } from "@heroicons/react/24/outline";
import cuid from "cuid";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import classNames from "../utils/class-name";
import { trpc } from "../utils/trpc";
import Card from "./Card";
import ModuleCard from "./ModuleCard";
import Workflow, { WorkflowItem, WorkflowStep } from "./Workflow";
const colors: string[] = [
  "bg-pink-600",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-green-500",
];
interface WorkflowPanelProps {
  currentWorkflow: WorkflowStep[];
  optionalSteps: WorkflowStep[];
}

const workflowItemCell = (workflowItem: WorkflowItem, color: string) => {
  return (
    <div
      id={workflowItem?.id}
      className="col-span-1 mb-4 flex h-16 whitespace-pre-wrap rounded-md shadow-sm"
    >
      <div
        className={classNames(
          color,
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md  text-sm font-medium text-white"
        )}
      >
        {workflowItem?.name?.substring(0, 1)}
      </div>
      <div
        className={classNames(
          "border-t border-r border-b",
          "flex flex-1 items-center justify-between truncate rounded-r-md  border-gray-200 bg-white"
        )}
      >
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a className="font-medium text-gray-900 hover:text-gray-600">
            {workflowItem.name} {workflowItem?.required ? "(Required)" : ""}
          </a>
          <p className="whitespace-pre-wrap text-gray-500">
            {workflowItem?.description}
          </p>
        </div>
        <div className="flex-shrink-0 pr-2"></div>
      </div>
    </div>
  );
};

const addWorkflowItem = (workflowStepId: string) => {
  return (
    <div
      onClick={() => alert(workflowStepId)}
      className="col-span-1 mb-4 flex h-16 rounded-md shadow-sm"
    >
      <div
        className={classNames(
          "bg-gray-300",
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md  text-sm font-medium text-white"
        )}
      >
        {"Add"}
      </div>
      <div
        className={classNames(
          "border-t border-r border-b",
          "flex flex-1 items-center justify-between truncate rounded-r-md  border-gray-200 bg-white"
        )}
      >
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a className="font-medium text-gray-900 hover:text-gray-600">
            {"Add new optional step"}
          </a>
          <p className="whitespace-pre-wrap text-gray-500">
            {"You can create your own optional step here"}
          </p>
        </div>
        <div className="flex-shrink-0 pr-2"></div>
      </div>
    </div>
  );
};

const RenderStep = (
  currentWorkflowStep: WorkflowStep,
  optionalWorkflowStep: WorkflowStep,
  index: number
) => {
  const [currentWorkflowItems, setCurrentWorkflowItems] = useState<
    WorkflowItem[]
  >(currentWorkflowStep?.items);

  const [optionalWorkflowItems, setOptionalWorkflowItems] = useState<
    WorkflowItem[]
  >(optionalWorkflowStep?.items);

  const utils = trpc.useContext();
  const { mutate } =
    trpc.workflow.associateWorkItemWithWorkflowStep.useMutation({
      async onSuccess(data, variables, context) {
        await utils.workflow.getCustomerWorkflow.invalidate();
      },
    });
  return (
    <div id="row" className="flex w-full flex-grow flex-row flex-wrap ">
      <div
        id="columnLeft"
        className="flex h-full flex-1 basis-1/2 flex-col  pr-4"
      >
        <div>{currentWorkflowStep.name}</div>
        <div>
          <div key={currentWorkflowStep.id}>
            <ReactSortable
              id={currentWorkflowStep.id}
              list={currentWorkflowItems}
              tag="div"
              group={currentWorkflowStep.workflowStepType}
              onAdd={(e) => {
                if (e.item.id) {
                  mutate({
                    stepId: currentWorkflowStep.id,
                    itemId: e.item.id,
                  });
                }
              }}
              filter=".required"
              setList={setCurrentWorkflowItems}
            >
              {currentWorkflowItems.map((workflowStepItem) => {
                return workflowItemCell(
                  workflowStepItem,
                  colors[index % colors.length] as string
                );
              })}
            </ReactSortable>
          </div>
        </div>
      </div>
      <div id="columnRight" className="flex h-full flex-1 basis-1/2 flex-col">
        <div>{optionalWorkflowStep.name}</div>
        <div>
          <div key={optionalWorkflowStep.id}>
            <ReactSortable
              id={optionalWorkflowStep.id}
              list={optionalWorkflowItems}
              tag="div"
              group={optionalWorkflowStep.workflowStepType}
              onAdd={(e) => {
                if (e.item.id) {
                  mutate({
                    stepId: optionalWorkflowStep.id,
                    itemId: e.item.id,
                  });
                }
              }}
              filter=".required"
              setList={setOptionalWorkflowItems}
            >
              {optionalWorkflowItems.map((workflowStepItem) => {
                return workflowItemCell(
                  workflowStepItem,
                  colors[index % colors.length] as string
                );
              })}
            </ReactSortable>
          </div>
          <div>{addWorkflowItem(optionalWorkflowStep.id as string)}</div>
        </div>
      </div>
    </div>
  );
};

const renderSteps = (
  currentWorkflow: WorkflowStep[],
  optionalSteps: WorkflowStep[]
) => {
  return currentWorkflow.map((workflowStep, index) => {
    return RenderStep(
      workflowStep,
      optionalSteps?.at(index) as WorkflowStep,
      index
    );
  });
};

export default function WorkflowPanel(props: WorkflowPanelProps) {
  return (
    <div className="mt-8 flex flex-col">
      {renderSteps(props.currentWorkflow, props.optionalSteps)}
    </div>
  );
}
