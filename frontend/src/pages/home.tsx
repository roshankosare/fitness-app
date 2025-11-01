import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaDumbbell, FaRunning, FaAppleAlt, FaUsers } from "react-icons/fa";

const Home = () => {
  return (
    <div className="text-light">
      {/* Hero Section */}
      <section
        className="d-flex flex-column justify-content-center align-items-center text-center text-white"
        style={{
          backgroundImage: "url('banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "90vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "overlay",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold mb-3 text-white">
            Transform Your Body & Mind
          </h1>
          <p className="lead mb-4 text-white opacity-100">
            Achieve your fitness goals with guided workouts, nutrition plans,
            and community motivation.
          </p>
          <Button variant="light" size="lg" className="fw-semibold">
            Get Started
          </Button>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5 bg-black">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src="fitness.jpg"
                alt="Workout"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <h2 className="fw-bold mb-3 text-white">Why Choose MyApp?</h2>
              <p className="text-light opacity-90 mb-4">
                Whether you're a beginner or a pro, MyApp provides personalized
                workout plans, real-time tracking, and an empowering community
                to help you stay consistent.
              </p>
              <Button variant="outline-light">Learn More</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-dark  text-center">
        <Container className="">
          <h2 className="fw-bold mb-5 text-white">What We Offer</h2>
          <Row className="g-4">
            <Col xs={12} md={6} lg={3}>
              <Card className="bg-black text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaDumbbell size={40} className="text-info mb-3" />
                  <Card.Title className="fw-semibold text-white">
                    Strength Training
                  </Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Build lean muscle with professional workout plans.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Card className="bg-black text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaRunning size={40} className="text-success mb-3" />
                  <Card.Title className="fw-semibold text-white">
                    Cardio Workouts
                  </Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Increase endurance and stay active with guided routines.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Card className="bg-black text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaAppleAlt size={40} className="text-warning mb-3" />
                  <Card.Title className="fw-semibold text-white">
                    Nutrition Plans
                  </Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Balanced meal suggestions tailored for your body goals.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Card className="bg-black text-light border-0 h-100 shadow-sm">
                <Card.Body>
                  <FaUsers size={40} className="text-danger mb-3" />
                  <Card.Title className="fw-semibold text-white">
                    Community Support
                  </Card.Title>
                  <Card.Text className="text-light opacity-90">
                    Stay inspired with people sharing your fitness journey.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-5 bg-dark text-center text-white">
        <Container>
          <h2 className="fw-bold mb-3 text-white">
            Start Your Fitness Journey Today
          </h2>
          <p className="mb-4 text-light opacity-100">
            Join now and take your first step toward a stronger, healthier you.
          </p>
          <Button variant="dark" size="lg" className="fw-semibold bg-black">
            Join Now
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;
