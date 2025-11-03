import { useContext } from "react";
import { PlanBuilderContext } from "../context/planBuilderContext";

export const usePlanBuilder = () => {
  const context = useContext(PlanBuilderContext);
  if (!context) {
    throw new Error(
      "usePlanBuilderContext must be used within a PlanBuilderProvider"
    );
  }
  return context;
};
