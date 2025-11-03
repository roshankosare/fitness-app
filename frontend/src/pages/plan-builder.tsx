import { useParams } from "react-router-dom";

import { PlanBuilderProvider } from "../providers/planBuilderProvider";
import PlanBuilder from "../components/plan-builder/plan-builder";

const WeeklyPlanBuilder = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <PlanBuilderProvider planId={planId}>
      <PlanBuilder />
    </PlanBuilderProvider>
  );
};

export default WeeklyPlanBuilder;
