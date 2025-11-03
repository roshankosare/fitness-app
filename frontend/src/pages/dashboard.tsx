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
import { UserDashboard } from "../components/dashboard/user-dashboard";

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
    <div className=" min-vh-100 text-white py-5 p-0">
      <Container className="d-flex flex-column gap-5 p-2 px-sm-5">
        {/* <div className="d-flex justify-content-between align-items-center">
          <h2 className="fw-bold">Welcome Back</h2>
          <h5 className="fw-bold">{"Roshan Kosare"}</h5>
        </div> */}

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
        // {
        //   link: "/admin/subscribed-users",
        //   title: "Subscribed Users",
        //   icon: <FaUsers />,
        //   action: "View Users",
        // },
        // {
        //   link: "/admin/profile",
        //   title: "Profile",
        //   icon: <FaUserCircle />,
        //   action: "View Profile",
        // },
      ].map((card, idx) => (
        <Col key={idx} md={6} lg={4}>
          <Link to={card.link} className="text-decoration-none">
            <Card
              bg="black"
              text="white"
              className="h-100 shadow-sm border-0 rounded-5 py-3 "
            >
              <Card.Body className="d-flex gap-2 flex-column justify-content-center align-items-center text-center">
                <div className="text-white mb-3" style={{ fontSize: "2rem" }}>
                  {card.icon}
                </div>
                <Card.Title className="fw-semibold ">{card.title}</Card.Title>
                <Button className="bg-white px-4 rounded-5 py-1 text-black fw-semibold">
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
