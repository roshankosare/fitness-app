import React, { useState } from "react";
import { Card, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import type { Exercise } from "../../types";
import { usePlanBuilder } from "../../hooks/usePlanBuilder";

type Props = {
  weekIndex: number;
  dayIndex: number;
  exercise: Exercise;
  exIndex: number;
};

const mockFetchExercises = async (query: string) => {
  const all = [
    { id: "1", name: "Bench Press" },
    { id: "2", name: "Squats" },
    { id: "3", name: "Deadlift" },
    { id: "4", name: "Pull Ups" },
    { id: "5", name: "Push Ups" },
    { id: "6", name: "Lunges" },
    { id: "7", name: "Plank" },
  ];
  return all.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
};

export const AddExercise: React.FC<Props> = ({
  weekIndex,
  dayIndex,
  exercise,
  exIndex,
}) => {
  const [exerciseList, setExerciseList] = useState<
    { id: string; name: string }[]
  >([]);

  const searchExercise = async (value: string) => {
    const data = await mockFetchExercises(value);
    setExerciseList(data);
  };

  const { handleDayChange, selectExercise } = usePlanBuilder();
  return (
    <Card className="bg-dark border-secondary mb-3 position-relative p-3">
      {/* 🧠 Exercise Name with Live Search */}
      <InputGroup className="mb-2">
        <Form.Control
          type="text"
          placeholder="Exercise name..."
          className="bg-dark text-white border-secondary"
          value={exercise.name}
          onChange={(e) => searchExercise(e.target.value)}
        />
      </InputGroup>

      {/* 🔍 Show search results directly below the input */}
      {exerciseList.length > 0 && (
        <ListGroup
          variant="flush"
          className="bg-dark mb-2 rounded-3 border border-secondary"
        >
          {exerciseList.map((ex, i) => (
            <ListGroup.Item
              key={i}
              action
              onClick={() => {
                selectExercise(weekIndex, dayIndex, ex.name);
                setExerciseList([]);
              }}
              className="bg-transparent text-white border-secondary"
            >
              {ex.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* 🏋️ Sets & Reps Fields */}
      <Row>
        <Col>
          <Form.Control
            type="number"
            placeholder="Sets"
            className="bg-dark text-white border-secondary"
            value={exercise.sets}
            onChange={(e) =>
              handleDayChange(
                weekIndex,
                dayIndex,
                `exercises.${exIndex}.sets`,
                e.target.value
              )
            }
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            placeholder="Reps"
            className="bg-dark text-white border-secondary"
            value={exercise.reps}
            onChange={(e) =>
              handleDayChange(
                weekIndex,
                dayIndex,
                `exercises.${exIndex}.reps`,
                e.target.value
              )
            }
          />
        </Col>
      </Row>
    </Card>
  );
};

export default AddExercise;
