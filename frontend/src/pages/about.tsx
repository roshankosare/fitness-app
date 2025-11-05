import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBullseye, FaEye, FaDumbbell, FaRunning, FaAppleAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="text-light bg-dark min-vh-100">

      <section className="py-5 text-center bg-black">
        <Container>
          <h1 className="fw-bold text-white mb-3">About Fitness App</h1>
          <p className="text-light opacity-75">
            Learn more about our mission, vision, and the values that drive us to help you achieve your fitness goals.
          </p>
        </Container>
      </section>

      <section className="py-5 bg-dark">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <FaBullseye size={50} className="text-info mb-3" />
              <h2 className="fw-bold text-white mb-3">Our Mission</h2>
              <p className="text-light opacity-90">
                At Fitness App, our mission is to make fitness accessible and enjoyable for everyone. We aim to
                empower individuals through customized workout plans and nutrition guidance to lead a healthy lifestyle.
              </p>
            </Col>
            <Col md={6}>
              <FaEye size={50} className="text-success mb-3" />
              <h2 className="fw-bold text-white mb-3">Our Vision</h2>
              <p className="text-light opacity-90">
                We envision a world where fitness is a habit, not a challenge. Our goal is to build a supportive
                community that motivates people to stay consistent and confident in their health journey.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-black text-center">
        <Container>
          <h2 className="fw-bold mb-5 text-white">What We Offer</h2>
          <Row className="g-4">
            <Col xs={12} md={6} lg={4}>
              <Card className="bg-dark text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaDumbbell size={40} className="text-info mb-3" />
                  <Card.Title className="fw-semibold text-white">Workout Plans</Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Professionally designed strength and endurance programs for all levels.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="bg-dark text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaRunning size={40} className="text-success mb-3" />
                  <Card.Title className="fw-semibold text-white">Cardio & Stamina</Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Boost your stamina with custom cardio routines that suit your body type.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="bg-dark text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaAppleAlt size={40} className="text-warning mb-3" />
                  <Card.Title className="fw-semibold text-white">Nutrition Guidance</Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Get expert nutrition advice and meal plans to match your fitness goals.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;