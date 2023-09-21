import { WorkflowStepType } from "@prisma/client";
import { WorkflowStep } from "./WorkflowStep";

export interface WorkflowItem {
  id: string;
  name: string | null;
  description?: string;
  required?: boolean | null;
}

export interface WorkflowStep {
  id: string;
  name: string;
  items: WorkflowItem[];
  workflowStepType: WorkflowStepType;
}

interface WorkflowProps {
  optional?: boolean;
  workflowSteps?: WorkflowStep[];
}

const colors: string[] = [
  "bg-pink-600",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-green-500",
];

export default function Workflow(props: WorkflowProps) {
  return (
    <div>
      {props?.workflowSteps?.map((workflowStep, index) => {
        return (
          <WorkflowStep
            workflowStep={workflowStep}
            optionalWorkflow={props.optional || false}
            key={workflowStep.id}
            color={colors[index % colors.length] as string}
          />
        );
      })}
    </div>
  );
}
