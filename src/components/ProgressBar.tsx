interface ProgressBarProps {
  stepIndex: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  const { stepIndex } = props;
  function getStepClasses(index: number) {
    if (index === stepIndex) {
      return "text-center text-indigo-600";
    } else {
      return "text-center";
    }
  }
  return (
    <div className="pt-8 pb-8">
      <h4 className="sr-only">Onboarding Progress</h4>
      <div className="mt-6" aria-hidden="true">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600"
            style={{ width: `${25 * (stepIndex + 1)}%` }}
          />
        </div>
        <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
          <div className={getStepClasses(0)}>Employee Info</div>
          <div className={getStepClasses(1)}>Assets</div>
          <div className={getStepClasses(2)}>Work Orders</div>
          <div className={getStepClasses(3)}>Completed</div>
        </div>
      </div>
    </div>
  );
}
