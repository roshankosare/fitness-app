import {
  Card,
  Button,
  Row,
  Col,
  ProgressBar,
  Container,
} from "react-bootstrap";
import { FaPlus, FaUsers, FaDumbbell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !user)
    return <p className="text-center text-light mt-5">Loading...</p>;

  return (
    <div className="bg-dark min-vh-100 text-white py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold">
          {user.role === "ADMIN" ? "Admin Dashboard" : "My Fitness Dashboard"}
        </h2>

        {user.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />}
      </Container>
    </div>
  );
};

export default Dashboard;

// import { Row, Col, Card, Button, ProgressBar } from "react-bootstrap";
// import {
//   FaPlus,
//   FaDumbbell,
//   FaUsers,
//   FaUserCircle,
// } from "react-icons/fa";

// --- Admin Dashboard ---
export const AdminDashboard = () => {
  return (
    <Row className="g-4">
      {[
        {
          link: "/admin/create-plan",
          title: "Add New Plan",
          icon: <FaPlus />,
          action: "Add Plan",
        },
        {
          link: "/admin/create-workout",
          title: "Add New Workout",
          icon: <FaDumbbell />,
          action: "Add Workout",
        },
        {
          link: "/admin/manage-workouts",
          title: "Manage My Workouts",
          icon: <FaDumbbell />,
          action: "Manage",
        },
        {
          link: "/admin/manage-plans",
          title: "Manage Plans",
          icon: <FaDumbbell />,
          action: "Manage",
        },
        {
          link: "/admin/subscribed-users",
          title: "Subscribed Users",
          icon: <FaUsers />,
          action: "View Users",
        },
        {
          link: "/admin/profile",
          title: "Profile",
          icon: <FaUserCircle />,
          action: "View Profile",
        },
      ].map((card, idx) => (
        <Col key={idx} md={6} lg={4}>
          <Link to={card.link} className="text-decoration-none">
            <Card
              bg="black"
              text="white"
              className="h-100 shadow-sm border-0 rounded-5 py-2 "
            >
              <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                <div className="text-primary mb-3" style={{ fontSize: "2rem" }}>
                  {card.icon}
                </div>
                <Card.Title className="fw-semibold mb-2">
                  {card.title}
                </Card.Title>
                <Button variant="primary" className="mt-2 w-75">
                  {card.action}
                </Button>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

// --- User Dashboard ---
export const UserDashboard = () => {
  const currentPlan = {
    name: "Muscle Gain Program",
    progress: 65,
    startDate: "2025-10-10",
    endDate: "2025-11-30",
  };

  return (
    <>
      {/* Current Plan */}
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Card
            bg="black"
            text="light"
            className="shadow-lg border-0 rounded-5 p-4"
          >
            <Card.Body>
              <Card.Title className="mb-3 text-white fw-semibold">
                Current Plan: {currentPlan.name}
              </Card.Title>
              <p className="mb-1">
                <strong>Start Date:</strong> {currentPlan.startDate}
              </p>
              <p className="mb-3">
                <strong>End Date:</strong> {currentPlan.endDate}
              </p>
              <div>
                <strong>Progress:</strong>
                <ProgressBar
                  now={currentPlan.progress}
                  label={`${currentPlan.progress}%`}
                  variant="primary"
                  className="mt-2"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Actions */}
      <Row className="g-4">
        {[
          {
            link: "/",
            title: "Start New Plan",
            icon: <FaDumbbell />,
            action: "Start",
          },
          {
            link: "/",
            title: "Profile",
            icon: <FaUserCircle />,
            action: "View Profile",
          },
        ].map((card, idx) => (
          <Col key={idx} md={6} lg={4}>
            <Link to={card.link}>
              <Card
                bg="black"
                text="light"
                className="shadow-sm border-0 rounded-5 p-2"
              >
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <div className="text-white mb-3" style={{ fontSize: "2rem" }}>
                    {card.icon}
                  </div>
                  <Card.Title className="fw-semibold mb-2">
                    {card.title}
                  </Card.Title>
                  <Button variant="primary" className="mt-2 w-75">
                    {card.action}
                  </Button>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};
