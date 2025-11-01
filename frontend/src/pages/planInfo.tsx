import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  Badge,
} from "react-bootstrap";

// ---- Mock Data ----
const mockPlan = {
  id: "1",
  name: "Beginner Strength Plan",
  description:
    "A 4-week beginner-friendly strength training program designed to help you build a solid foundation of muscle and improve overall fitness.",
  createdBy: { fullName: "John Doe" },
  bannerImage: "./banner.jpg",
  active: true,
  createdAt: "2025-10-01T00:00:00Z",
  updatedAt: "2025-10-10T00:00:00Z",
  weeks: [
    {
      id: "w1",
      weekNumber: 1,
      activities: {
        Monday: "Full-body workout",
        Tuesday: "Cardio + Stretch",
        Wednesday: "Upper Body Strength",
        Thursday: "Rest",
        Friday: "Lower Body Strength",
        Saturday: "Cardio + Core",
        Sunday: "Rest",
      },
    },
    {
      id: "w2",
      weekNumber: 2,
      activities: {
        Monday: "Push Workout",
        Tuesday: "Pull Workout",
        Wednesday: "Cardio",
        Thursday: "Leg Day",
        Friday: "Core Training",
        Saturday: "Yoga & Recovery",
        Sunday: "Rest",
      },
    },
  ],
};

const mockWorkouts = [
  {
    id: "w1",
    exercise: "Bench Press",
    image: "https://via.placeholder.com/300x180?text=Bench+Press",
    date: "2025-10-01",
  },
  {
    id: "w2",
    exercise: "Squats",
    image: "https://via.placeholder.com/300x180?text=Squats",
    date: "2025-10-02",
  },
  {
    id: "w3",
    exercise: "Deadlift",
    image: "https://via.placeholder.com/300x180?text=Deadlift",
    date: "2025-10-03",
  },
];

// ---- Component ----
const PlanInfo = () => {
  const { id } = useParams();
  const plan = mockPlan;

  return (
    <Container className="py-5 text-white px-0" style={{ maxWidth: "900px" }}>
      {/* Banner */}
      <div
        className="position-relative mb-5 rounded-4 overflow-hidden shadow-lg"
        style={{ maxHeight: "400px" }}
      >
        <img
          src="/banner.jpg"
          alt={plan.name}
          className="w-100"
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-5"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
          }}
        >
          <h1 className="fw-bold">{plan.name}</h1>
          <p className="text-white-50 mb-3" style={{ maxWidth: "700px" }}>
            {plan.description}
          </p>
          <Button variant="primary" className="fw-semibold px-4 py-2">
            Start This Plan
          </Button>
        </div>
      </div>

      {/* Plan Details */}
      <Row className="gy-4 mb-5">
        <Col md={6}>
          <Card className="bg-gradient border-0 shadow-sm rounded-4 p-3 bg-dark bg-opacity-75">
            <Card.Body>
              <Card.Title className="fw-bold text-uppercase text-primary mb-3">
                Plan Details
              </Card.Title>
              <div className="text-white-50">
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
        </Col>
      </Row>

      {/* Weekly Breakdown */}
      <div className="mb-5">
        <h3 className="fw-bold mb-4 text-primary border-bottom pb-2">
          Weekly Breakdown
        </h3>
        {plan.weeks.map((week) => (
          <Card
            key={week.id}
            className="bg-dark border-0 text-light mb-4 shadow-sm rounded-4"
          >
            <Card.Body>
              <Card.Title className="text-info fw-bold mb-3">
                Week {week.weekNumber}
              </Card.Title>
              <ListGroup variant="flush" className="bg-dark">
                {Object.entries(week.activities).map(([day, activity]) => (
                  <ListGroup.Item
                    key={day}
                    className="bg-transparent text-white-50 border-secondary d-flex justify-content-between align-items-center"
                  >
                    <span className="fw-semibold text-white">{day}</span>
                    <span>{activity}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default PlanInfo;
