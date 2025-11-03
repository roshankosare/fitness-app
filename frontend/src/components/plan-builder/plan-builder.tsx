import { useState } from "react";
import { Loading } from "../loading";
import { usePlanBuilder } from "../../hooks/usePlanBuilder";
import { Button, Card, Collapse, Container } from "react-bootstrap";
import WeekBuilder from "./week-builder";

const PlanBuilder = () => {
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const { plan, weeks, savePlan, addWeek, loading } = usePlanBuilder();

  if (loading) return <Loading />;

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId]
    );
  };

  const toggleDay = (weekIndex: number, dayIndex: number) => {
    const key = `${weekIndex}-${dayIndex}`;
    setExpandedDays((prev) => {
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach((k) => (newState[k] = false)); // collapse all others
      newState[key] = !prev[key]; // toggle clicked one
      return newState;
    });
  };

  // Find the currently expanded day (only one at a time)
  const getExpandedDay = (weekIndex: number) => {
    const activeKey = Object.keys(expandedDays).find(
      (key) => expandedDays[key]
    );
    if (!activeKey) return null;
    const [wIndex, dIndex] = activeKey.split("-").map(Number);
    if (wIndex !== weekIndex) return null;
    return weeks[wIndex]?.days[dIndex] ?? null;
  };

  return (
    <Container
      className="py-5 text-white"
      style={{ maxWidth: "1000px", backgroundColor: "#0b0b0b" }}
    >
      <h2 className="fw-bold mb-4 text-center text-white">
        Weekly Plan Builder
      </h2>
      <p className="text-center text-white mb-4">
        Plan Name: <strong>{plan?.name}</strong>
      </p>

      <div className="d-flex justify-content-center mb-4">
        <Button
          onClick={addWeek}
          className=" bg-white px-5 rounded-5 py-2 text-black fw-semibold"
        >
          Add Week
        </Button>
      </div>

      {weeks.map((week, weekIndex) => {
        const expandedDay = getExpandedDay(weekIndex);

        return (
          <Card
            key={week.id}
            className="bg-dark border-0 text-light mb-4 shadow-sm rounded-4 pb-4"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-info fw-bold">Week {weekIndex + 1}</h4>
                <Button
                  className="bg-white px-3 rounded-5 py-1 text-black fw-semibold"
                  size="sm"
                  onClick={() => toggleWeek(week.id)}
                >
                  {expandedWeeks.includes(week.id) ? "Hide" : "Show"}
                </Button>
              </div>

              <Collapse in={expandedWeeks.includes(week.id)}>
                <div className="row g-3">
                  {/* Left: Days List */}
                  <div className="col-12 col-md-3">
                    <div className="d-flex flex-md-column flex-row flex-wrap gap-2">
                      {week.days.map((day, dayIndex) => {
                        const key = `${weekIndex}-${dayIndex}`;
                        const isActive = expandedDays[key];
                        return (
                          <Button
                            key={key}
                            // variant={isActive ? "info" : "outline-info"}
                            className={`w-100 btn-outline-light rounded-4  text-start bg-transparent text-white ${
                              isActive ? "" : ""
                            }`}
                            onClick={() => toggleDay(weekIndex, dayIndex)}
                          >
                            {day.day}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Expanded Day */}
                  <div className="col-12 col-md-9">
                    {expandedDay && (
                      <WeekBuilder
                        expandedDays={expandedDays}
                        toggleDay={() =>
                          toggleDay(weekIndex, week.days.indexOf(expandedDay))
                        }
                        keyId={`${weekIndex}-${week.days.indexOf(expandedDay)}`}
                        weekIndex={weekIndex}
                        dayIndex={week.days.indexOf(expandedDay)}
                        day={expandedDay}
                      />
                    )}
                  </div>
                </div>
              </Collapse>
            </Card.Body>

            <div className="text-center mt-4">
              <Button
                className="bg-white px-5 rounded-5 py-2 text-black fw-semibold"
                onClick={() => savePlan(weekIndex)}
              >
                Save Weekly Plan
              </Button>
            </div>
          </Card>
        );
      })}
    </Container>
  );
};

export default PlanBuilder;
