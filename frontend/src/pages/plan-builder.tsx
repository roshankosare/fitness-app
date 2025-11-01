import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";

// Mock async search (replace with API call)
const mockFetchExercises = async (query: string) => {
  const all = [
    "Bench Press",
    "Squats",
    "Deadlift",
    "Pull Ups",
    "Push Ups",
    "Lunges",
    "Plank",
  ];
  return all.filter((e) => e.toLowerCase().includes(query.toLowerCase()));
};

const WeeklyPlanBuilder = () => {
  const { planId } = useParams(); // get plan id from route
  const [weeks, setWeeks] = useState<any[]>([]);

  const addWeek = () => {
    if (weeks.length >= 4) return alert("Maximum 4 weeks allowed!");
    setWeeks([
      ...weeks,
      {
        id: Date.now(),
        days: Array.from({ length: 7 }, (_, i) => ({
          day: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ][i],
          exercise: "",
          sets: "",
          reps: "",
          searchResults: [],
        })),
      },
    ]);
  };

  const handleDayChange = async (
    weekIndex: number,
    dayIndex: number,
    field: string,
    value: string
  ) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];

    if (field === "exercise") {
      day.exercise = value;
      if (value.trim().length > 0) {
        day.searchResults = await mockFetchExercises(value);
      } else {
        day.searchResults = [];
      }
    } else {
      (day as any)[field] = value;
    }

    setWeeks(newWeeks);
  };

  const selectExercise = (
    weekIndex: number,
    dayIndex: number,
    name: string
  ) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];
    day.exercise = name;
    day.searchResults = [];
    setWeeks(newWeeks);
  };

  const savePlan = () => {
    console.log("Saving plan:", { planId, weeks });
    alert("Weekly plan saved (check console for output)");
  };

  return (
    <Container
      className="py-5 text-white"
      style={{ maxWidth: "1000px", backgroundColor: "#0b0b0b" }}
    >
      <h2 className="fw-bold mb-4 text-center text-primary">
        Weekly Plan Builder
      </h2>
      <p className="text-center text-white-50 mb-4">
        Plan ID: <strong>{planId}</strong>
      </p>

      <div className="d-flex justify-content-center mb-4">
        <Button variant="primary" onClick={addWeek} className="fw-semibold">
          ➕ Add Week
        </Button>
      </div>

      {weeks.map((week, weekIndex) => (
        <Card
          key={week.id}
          className="bg-dark border-0 text-light mb-4 shadow-sm rounded-4"
        >
          <Card.Body>
            <h4 className="text-info fw-bold mb-3">Week {weekIndex + 1}</h4>
            <Row>
              {week.days.map((day, dayIndex) => (
                <Col md={6} key={day.day} className="mb-4">
                  <Card className="bg-secondary bg-opacity-25 border-0 rounded-3 p-3">
                    <h6 className="fw-bold text-white mb-3">{day.day}</h6>

                    {/* Search Exercise */}
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="text"
                        value={day.exercise}
                        placeholder="Search exercise..."
                        className="bg-dark text-white border-secondary"
                        onChange={(e) =>
                          handleDayChange(
                            weekIndex,
                            dayIndex,
                            "exercise",
                            e.target.value
                          )
                        }
                      />
                    </InputGroup>

                    {day.searchResults.length > 0 && (
                      <ListGroup
                        variant="flush"
                        className="bg-dark mb-2 rounded-3"
                      >
                        {day.searchResults.map((ex: string) => (
                          <ListGroup.Item
                            key={ex}
                            action
                            onClick={() =>
                              selectExercise(weekIndex, dayIndex, ex)
                            }
                            className="bg-transparent text-white border-secondary"
                          >
                            {ex}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}

                    {/* Sets & Reps */}
                    <Row>
                      <Col>
                        <Form.Control
                          type="number"
                          placeholder="Sets"
                          className="bg-dark text-white border-secondary"
                          value={day.sets}
                          onChange={(e) =>
                            handleDayChange(
                              weekIndex,
                              dayIndex,
                              "sets",
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
                          value={day.reps}
                          onChange={(e) =>
                            handleDayChange(
                              weekIndex,
                              dayIndex,
                              "reps",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      ))}

      {weeks.length > 0 && (
        <div className="text-center mt-4">
          <Button
            variant="success"
            className="fw-semibold px-5 py-2"
            onClick={savePlan}
          >
            💾 Save Weekly Plan
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WeeklyPlanBuilder;
