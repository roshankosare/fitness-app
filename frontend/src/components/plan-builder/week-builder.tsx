import React from "react";
import { Button, Card, Collapse, Form } from "react-bootstrap";
import type { WeekDay } from "../../types";
import AddExercise from "./add-exercise";
import { usePlanBuilder } from "../../hooks/usePlanBuilder";

type Props = {
  toggleDay: () => void;
  day: WeekDay;
  expandedDays: Record<string, boolean>;
  weekIndex: number;
  dayIndex: number;
  keyId: string;
};

const WeekBuilder: React.FC<Props> = ({
  toggleDay,
  day,
  expandedDays,
  keyId,
  weekIndex,
  dayIndex,
}) => {
  const { handleDayChange, addExercise } = usePlanBuilder();

  return (
    <Card className="bg-secondary bg-opacity-25 border-0 rounded-3 p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold text-white mb-0">{day.day}</h6>
        <Button
          className=" bg-white px-3 rounded-5 py-1 text-black fw-semibold "
          size="sm"
          onClick={() => toggleDay()}
        >
          {expandedDays[keyId] ? "Hide Exercises" : "Show Day"}
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Workout Day Name (e.g. Chest Day)"
        className="bg-dark text-white border-secondary mb-3"
        value={day.workoutName || ""}
        onChange={(e) =>
          handleDayChange(weekIndex, dayIndex, "workoutName", e.target.value)
        }
      />

      <Collapse in={expandedDays[keyId]}>
        <div className="">
          <div className="row g-3">
            {day.exercises.map((exercise, exIndex) => (
              <div className="col-12 col-md-6" key={exIndex}>
                <AddExercise
                  exercise={exercise}
                  weekIndex={weekIndex}
                  dayIndex={dayIndex}
                  exIndex={exIndex}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-3">
            <Button
              className="bg-white px-3 rounded-5 py-1 text-black fw-semibold"
              size="sm"
              onClick={() => addExercise(weekIndex, dayIndex)}
            >
              Add Exercise
            </Button>
          </div>
        </div>
      </Collapse>
    </Card>
  );
};

export default WeekBuilder;
