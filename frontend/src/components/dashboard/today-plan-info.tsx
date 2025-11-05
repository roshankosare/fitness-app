import React, { useState } from "react";
import { Button, Card, ListGroup, Badge } from "react-bootstrap";
import type { WeekDay } from "../../types";
// adjust import as needed

type Props = {
  weekDay?: WeekDay;
};

const TodaysPlanInfo: React.FC<Props> = ({ weekDay }) => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const handleCompleteExercise = (exerciseName: string) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  if (!weekDay) return null;

  const allCompleted = completedExercises.length === weekDay.exercises.length;

  return (
    <Card className="border-0 shadow-sm rounded-4 p-3 mt-4 bg-dark text-white">
      <Card.Body>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-2">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h5 className="fw-bold mb-1">
              {weekDay.workoutName || "Rest Day"}
            </h5>
            <p className="text-secondary mb-0">{weekDay.day}</p>
          </div>

          <Button
            disabled={allCompleted}
            onClick={() => console.log("Workout started")}
            className="rounded-pill px-4 py-2 bg-white text-black fw-bold"
          >
            {allCompleted ? "Completed" : "Start Workout"}
          </Button>
        </div>

        <ListGroup variant="flush">
          {weekDay.exercises.map((exercise, index) => (
            <ListGroup.Item
              key={index}
              className="bg-transparent d-flex justify-content-between align-items-center border-secondary"
            >
              <div>
                <h6 className="mb-0 fw-semibold">{exercise.name}</h6>
                <small className="text-secondary">
                  {exercise.sets} sets × {exercise.reps} reps
                </small>
              </div>

              <Button
                size="sm"
                variant={
                  completedExercises.includes(exercise.name)
                    ? "success"
                    : "outline-light"
                }
                onClick={() => handleCompleteExercise(exercise.name)}
                className="rounded-3"
              >
                {completedExercises.includes(exercise.name)
                  ? "Done"
                  : "Mark Complete"}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {allCompleted && (
          <div className="text-center mt-3">
            <Badge bg="success" className="p-2 rounded-3">
              🎉 All exercises completed!
            </Badge>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TodaysPlanInfo;
