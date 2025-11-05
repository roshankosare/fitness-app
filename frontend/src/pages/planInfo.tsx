import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import type { Plan, PlanWeek, User } from "@prisma/client";
import type { DayName, WeekDay } from "../types";
import axios, { AxiosError } from "axios";
import Error from "../components/error";

const PlanInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [plan, setPlan] = useState<
    | (Plan & {
        createdBy: Pick<User, "fullName">;
        weeks: (Pick<PlanWeek, "id" | "weekNumber"> & { days: WeekDay[] })[];
      })
    | null
  >(null);

  const [selectedWeek, setSelectedWeek] = useState<
    (Pick<PlanWeek, "id" | "weekNumber"> & { days: WeekDay[] }) | null
  >(null);

  const handleStartPlan = async () => {
    if (!id) {
      navigate("/");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:4000/api/user-profile/subscribe/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setMessage(
          "Congratulation you have subscribed this plan. Visit dashboard to see"
        );
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          navigate("/signin");
          return;
        }
        setMessage(err.response?.data.message || "something went wrong");
      }
    }
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/workout-plans/${id}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const planData = res.data.data as Plan & {
            createdBy: Pick<User, "fullName">;
            weeks: PlanWeek[];
          };

          // Transform weeks with days structure
          const planWeeks = planData.weeks.map((week: PlanWeek) => {
            const activities = (week.activities || {}) as WeekDay[];

            return {
              ...week,
              days: (
                [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ] as DayName[]
              ).map((day) => {
                const activityDay = activities.find((d) => d.day === day);

                return {
                  day,
                  workoutName: activityDay?.workoutName || "",
                  exercises: activityDay?.exercises || [],
                };
              }),
            };
          });

          const fullPlan = {
            ...planData,
            weeks: planWeeks,
          };

          setPlan(fullPlan);
          setSelectedWeek(planWeeks[0] ?? null);
        }
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
          console.error(err.response?.data || err.message);
          navigate("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [navigate, id]);

  // === Render conditions ===
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-white">
        <Spinner animation="border" variant="light" />
      </div>
    );

  if (!plan) return <Error />;

  // === JSX ===
  return (
    <Container className="py-2 text-white px-0" style={{ maxWidth: "900px" }}>
      {/* Banner */}
      <div
        className="position-relative mb-5 rounded-4 overflow-hidden shadow-lg"
        style={{ maxHeight: "400px" }}
      >
        <img
          src={plan.bannerImage || "/banner.jpg"}
          alt={plan.name}
          className="w-100"
          style={{ height: "400px", objectFit: "cover" }}
        />

        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3 p-md-5"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
          }}
        >
          <div
            className="rounded-4 p-2 p-md-3"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              maxWidth: "700px",
            }}
          >
            <h1 className="fw-bold text-white">{plan.name}</h1>
            <p className="text-white-50 mb-3">{plan.description}</p>
            <div className="d-flex flex-sm-column justify-content-between gap-2">
              <Button
                className="fw-semibold bg-white px-4 py-2 text-black rounded-pill"
                onClick={() => handleStartPlan()}
                style={{
                  maxWidth: "160px",
                }}
              >
                Start This Plan
              </Button>
              {message && <p className="text-white fw-bold">{message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <Row className="gy-4 mb-5 px-2">
        <Card className="bg-gradient border-0 shadow-sm rounded-4 p-2 bg-dark bg-opacity-75 w-100">
          <Card.Body>
            <div className="text-white d-flex flex-wrap justify-content-between gap-2">
              <p>
                <strong>Created By:</strong> {plan.createdBy.fullName}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={plan.active ? "success" : "secondary"}>
                  {plan.active ? "Active" : "Inactive"}
                </Badge>
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(plan.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated:</strong>{" "}
                {new Date(plan.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </Card.Body>
        </Card>
      </Row>

      {/* Weekly Breakdown */}
      <div className="mb-5">
        <h3 className="fw-bold mb-4 text-white border-bottom pb-2">
          Weekly Breakdown
        </h3>

        <Row>
          {/* Left side — Week buttons */}
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <div className="d-flex flex-row flex-md-column flex-wrap gap-2 justify-content-center">
              {plan.weeks.map((week) => (
                <Button
                  key={week.id}
                  className={`fw-semibold text-start rounded-4 px-3 py-2 ${
                    selectedWeek?.id === week.id
                      ? "bg-white text-black"
                      : "bg-black text-white border-white"
                  }`}
                  onClick={() => setSelectedWeek(week)}
                >
                  Week {week.weekNumber}
                </Button>
              ))}
            </div>
          </Col>

          {/* Right side — Week details */}
          <Col xs={12} md={9}>
            {selectedWeek ? (
              <Card className="bg-dark border-0 text-light shadow-sm rounded-4">
                <Card.Body>
                  <Card.Title className="text-white fw-bold mb-3">
                    Week {selectedWeek.weekNumber}
                  </Card.Title>
                  <ListGroup variant="flush" className="bg-dark">
                    {selectedWeek.days.map((day) => (
                      <ListGroup.Item
                        key={day.day}
                        className="bg-transparent text-white-50 border-secondary d-flex justify-content-between align-items-center"
                      >
                        <span className="fw-semibold text-white">
                          {day.day}
                        </span>
                        <span>{day.workoutName || "Rest"}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-white-50">No week selected.</p>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default PlanInfo;
