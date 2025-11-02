import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Collapse,
  ListGroup,
} from "react-bootstrap";
import { useState } from "react";
import { usePlanBuilder } from "../hooks/usePlanBuilder";
import { Loading } from "../components/loading";

const WeeklyPlanBuilder = () => {
  const { planId } = useParams<{ planId: string }>();
  const {
    plan,
    weeks,
    selectExercise,
    savePlan,
    handleDayChange,
    addWeek,
    addExercise,
    loading,
    exerciseList,
    searchExercise,
  } = usePlanBuilder(planId);

  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  if (loading) return <Loading />;

  const toggleWeek = (weekId: string | number) => {
    setExpandedWeeks((prev) =>
      prev.includes(Number(weekId))
        ? prev.filter((id) => id !== Number(weekId))
        : [...prev, Number(weekId)]
    );
  };

  const toggleDay = (weekIndex: number, dayIndex: number) => {
    const key = `${weekIndex}-${dayIndex}`;
    setExpandedDays((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
        Plan Name: <strong>{plan?.name}</strong>
      </p>

      <div className="d-flex justify-content-center mb-4">
        <Button variant="primary" onClick={addWeek} className="fw-semibold">
          ➕ Add Week
        </Button>
      </div>

      {weeks.map((week, weekIndex) => (
        <Card
          key={week.id}
          className="bg-dark border-0 text-light mb-4 shadow-sm rounded-4 pb-4"
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-info fw-bold">Week {weekIndex + 1}</h4>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => toggleWeek(week.id)}
              >
                {expandedWeeks.includes(Number(week.id)) ? "Hide" : "Show"}
              </Button>
            </div>

            <Collapse in={expandedWeeks.includes(Number(week.id))}>
              <div>
                {week.days.map((day, dayIndex) => {
                  const key = `${weekIndex}-${dayIndex}`;
                  return (
                    <Card
                      key={day.day}
                      className="bg-secondary bg-opacity-25 border-0 rounded-3 p-3 mb-3"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold text-white mb-0">{day.day}</h6>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => toggleDay(weekIndex, dayIndex)}
                        >
                          {expandedDays[key] ? "Hide Exercises" : "Show Day"}
                        </Button>
                      </div>

                      <Form.Control
                        type="text"
                        placeholder="Workout Day Name (e.g. Chest Day)"
                        className="bg-dark text-white border-secondary mb-3"
                        value={day.workoutName || ""}
                        onChange={(e) =>
                          handleDayChange(
                            weekIndex,
                            dayIndex,
                            "workoutName",
                            e.target.value
                          )
                        }
                      />

                      <Collapse in={expandedDays[key]}>
                        <div>
                          {day.exercises.map((exercise, exIndex) => (
                            <Card
                              key={exIndex}
                              className="bg-dark border-secondary mb-3 p-3 position-relative"
                            >
                              {/* 🧠 Exercise Name with Live Search */}
                              <InputGroup className="mb-2">
                                <Form.Control
                                  type="text"
                                  placeholder="Exercise name..."
                                  className="bg-dark text-white border-secondary"
                                  value={exercise.name}
                                  onChange={(e) =>
                                    searchExercise(e.target.value)
                                  }
                                />
                              </InputGroup>

                              {/* 🔍 Show search results directly below the input */}
                              {exerciseList && exerciseList.length > 0 && (
                                <ListGroup
                                  variant="flush"
                                  className="bg-dark mb-2 rounded-3 border border-secondary"
                                >
                                  {exerciseList.map((ex, i) => (
                                    <ListGroup.Item
                                      key={i}
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
                          ))}

                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => addExercise(weekIndex, dayIndex)}
                          >
                            ➕ Add Exercise
                          </Button>
                        </div>
                      </Collapse>
                    </Card>
                  );
                })}
              </div>
            </Collapse>
          </Card.Body>
          <div className="text-center mt-4">
            <Button
              variant="success"
              className="fw-semibold px-5 py-2"
              onClick={() => savePlan(weekIndex)}
            >
              💾 Save Weekly Plan
            </Button>
          </div>
        </Card>
      ))}
    </Container>
  );
};

export default WeeklyPlanBuilder;
