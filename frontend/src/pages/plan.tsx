import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const mockPlans = [
  {
    id: "1",
    name: "Beginner Strength Plan",
    description:
      "A 4-week strength training program focused on building a solid foundation.",
    bannerImage: "https://via.placeholder.com/400x250?text=Beginner+Plan",
  },
  {
    id: "2",
    name: "Fat Loss Plan",
    description:
      "A 6-week intense fat-burning plan combining cardio and resistance training.",
    bannerImage: "https://via.placeholder.com/400x250?text=Fat+Loss+Plan",
  },
  {
    id: "3",
    name: "Muscle Gain Plan",
    description:
      "An 8-week program designed for hypertrophy and muscle building.",
    bannerImage: "https://via.placeholder.com/400x250?text=Muscle+Gain+Plan",
  },
];

const Plans = () => {
  return (
    <div className="py-5 text-white container">
      <h2 className="text-center mb-5 fw-bold">Workout Plans</h2>

      {/* ✅ Use proper responsive grid */}
      <Row className="g-4">
        {mockPlans.map((plan) => (
          <Col key={plan.id} xs={12} md={6} lg={4}>
            <Card className="bg-dark text-light shadow border-0 h-100">
              <Card.Img
                src={"banner.jpg"}
                alt={plan.name}
                className="img-fluid rounded-top"
              />

              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-white">
                  {plan.name}
                </Card.Title>
                <Card.Text className="text-white-50 flex-grow-1">
                  {plan.description}
                </Card.Text>
                <Link to={`/plans/${plan.id}`} className="mt-auto text-center">
                  <Button className="bg-white px-5 rounded-5 py-2 text-black fw-semibold">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Plans;
