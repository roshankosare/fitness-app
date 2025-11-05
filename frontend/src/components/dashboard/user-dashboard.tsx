import { Button, Card, Col, Row } from "react-bootstrap";
import {
  FaBirthdayCake,
  FaMale,
  FaRulerVertical,
  FaWeight,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import FitnessGoalCard from "../profile/fitness-goal-card";
import Error from "../error";
import { PlanProgress } from "./plan-progress";
import { useUserDashboard } from "../../hooks/useUserDashBoard";

export const UserDashboard = () => {
  const { error, userProfile, currentPlan, currentWeekDay, loading } =
    useUserDashboard();

  if (error) return <Error />;

  return (
    <>
      {userProfile && (
        <Row className="mb-5">
          <Col md={12} className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="w-100 d-flex flex-column flex-sm-row justify-content-between align-items-center text-center text-md-start">
              <h2 className="fw-bold mb-0 text-primary">Welcome Back 👋</h2>
              <h5 className="fw-bold mb-0 text-light">
                {userProfile?.fullName}
              </h5>
            </div>

            <FitnessGoalCard goal={userProfile.userProfile.goal || undefined} />

            {/* Info Boxes */}
            <Row className="g-3 px-3">
              <Col xs={6} md={3}>
                <div className="d-flex align-items-center justify-content-center bg-white text-black fw-bold px-3 py-3 rounded-5 shadow-sm gap-2 h-100">
                  <FaWeight size={20} className="text-primary" />
                  <span>Weight:</span>
                  <span>{userProfile?.userProfile.weightKg}kg</span>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="d-flex align-items-center justify-content-center bg-white text-black fw-bold px-3 py-3 rounded-5 shadow-sm gap-2 h-100">
                  <FaRulerVertical size={20} className="text-success" />
                  <span>Height:</span>
                  <span>{userProfile?.userProfile.heightCm}cm</span>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="d-flex align-items-center justify-content-center bg-white text-black fw-bold px-3 py-3 rounded-5 shadow-sm gap-2 h-100">
                  <FaBirthdayCake size={20} className="text-warning" />
                  <span>Age:</span>
                  <span>{userProfile?.userProfile.age}</span>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="d-flex align-items-center justify-content-center bg-white text-black fw-bold px-3 py-3 rounded-5 shadow-sm gap-2 h-100">
                  <FaMale size={20} className="text-info" />
                  <span>Gender:</span>
                  <span>Male</span>
                </div>
              </Col>
            </Row>

            {/* Current Plan Section */}
            {currentPlan && (
              <Row>
                <Col md={12}>
                  <Card className="border-0 shadow-sm rounded-4 bg-black p-0 ">
                    <Card.Body>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                          <div className="d-flex flex-column flex-sm-row gap-2 mb-2 align-items-center mx-auto w-100">
                            <h4 className="fw-bold text-dark mb-2 text-white">
                              <FaChartLine className="text-primary me-2" />
                              {currentPlan?.plan.name}
                            </h4>

                            <Link to={`/plans/${currentPlan.planId}`}>
                              <Button className="bg-white text-black rounded-pill px-4 py-1 fw-bold ">
                                See Plan
                              </Button>
                            </Link>
                          </div>
                          <p className="text-muted mb-3">
                            Stay consistent and push your limits! 💪
                          </p>
                        </div>
                        {/* <div className="text-md-end">
                          <span className="fw-semibold text-primary">
                            Progress: {65}%
                          </span>
                          <ProgressBar
                            now={65}
                            className="mt-2"
                            variant="primary"
                            style={{ height: "8px", width: "300px" }}
                          />
                        </div> */}
                      </div>

                      <PlanProgress
                        currentPlan={currentPlan}
                        weekDay={currentWeekDay || undefined}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {!currentPlan && !loading && (
              <Row>
                <Col md={12}>
                  <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <p className="fs-2 fw-bold text-white mb-3">
                      No Plan selected, Select Plan To Begin new Journey
                    </p>
                    <Link to="/plans" className="text-decoration-none">
                      <Button className="bg-white text-black px-4 py-2 fs-5 rounded-pill fw-bold d-block mx-auto">
                        Select Plan
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};
