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
    <div className="py-5 text-white container-sm d-flex flex-column align-items-center">
      <h2 className="text-center mb-5 fw-bold">Workout Plans</h2>

      {mockPlans.map((plan) => (
        <Card
          key={plan.id}
          className="bg-dark text-light mb-4 shadow border-0 w-100"
          style={{ maxWidth: "800px" }}
        >
          <Row className="g-0 align-items-center">
            <Col md={5}>
              <Card.Img
                src={"banner.jpg"}
                alt={plan.name}
                className="img-fluid rounded-start"
              />
            </Col>
            <Col md={7}>
              <Card.Body>
                <Card.Title className="fw-bold text-white">
                  {plan.name}
                </Card.Title>
                <Card.Text className="text-white-50">
                  {plan.description}
                </Card.Text>
                <Link to={"/plans/1"}>
                  <Button variant="primary" className="mt-2 fw-semibold">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default Plans;
