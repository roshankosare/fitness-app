import type { Plan, User, UserPlan, UserProfile } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, ProgressBar, Row } from "react-bootstrap";
import {
  FaBirthdayCake,
  FaMale,
  FaRulerVertical,
  FaWeight,
  FaChartLine,
  FaDumbbell,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const UserDashboard = () => {
  const [currentPlan, setCurrentPlan] = useState<{
    userPlans: UserPlan & { plan: Plan };
  }>();
  const [userProfile, setUserProfile] = useState<
    (Pick<User, "fullName" | "email"> & { userProfile: UserProfile }) | null
  >(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user-profile", {
          withCredentials: true,
        });
        setUserProfile(res.data.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(true);
        }
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/user-profile/user-plan",
          {
            withCredentials: true,
          }
        );
        if (res.data.data.userPlans) {
          setCurrentPlan(res.data.data.userPlans);
          return;
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlan();
  }, []);

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
                  <Card className="border-0 shadow-sm rounded-4 bg-black p-0">
                    <Card.Body>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div>
                          <h4 className="fw-bold text-dark mb-2 text-white">
                            <FaChartLine className="text-primary me-2" />
                            {currentPlan?.userPlans.plan.name}
                          </h4>
                          <p className="text-muted mb-3">
                            Stay consistent and push your limits! 💪
                          </p>
                        </div>
                        <div className="text-md-end">
                          <span className="fw-semibold text-primary">
                            Progress: {65}%
                          </span>
                          <ProgressBar
                            now={65}
                            className="mt-2"
                            variant="primary"
                            style={{ height: "8px", width: "300px" }}
                          />
                        </div>
                      </div>

                      <Row className="mt-4 g-3">
                        {/* Week */}
                        <Col xs={6} md={3}>
                          <Card className="border-0 shadow-sm rounded-4 text-center py-3">
                            <Card.Body>
                              <FaCalendarAlt
                                size={28}
                                className="text-success mb-2"
                              />
                              <h6 className="fw-bold mb-0 text-white">Week</h6>
                              <p className="mb-0 text-white">
                                {/* {currentPlan?.userPlans?.progress?.week || 4} */}
                                4
                              </p>
                            </Card.Body>
                          </Card>
                        </Col>

                        {/* Day */}
                        <Col xs={6} md={3}>
                          <Card className="border-0 shadow-sm rounded-4 text-center py-3">
                            <Card.Body>
                              <FaClock
                                size={28}
                                className="text-warning mb-2"
                              />
                              <h6 className="fw-bold mb-0 text-white">Day</h6>
                              {/* <p className="mb-0 text-white">{`${currentPlan.currentDay} / ${currentPlan.totalPlanDays}`}</p> */}
                              <p className="mb-0 text-white">{`75 / 120`}</p>
                            </Card.Body>
                          </Card>
                        </Col>

                        {/* Today's Workout */}
                        <Col xs={12} md={6}>
                          <Card className="border-0 shadow-sm rounded-4 text-center py-3">
                            <Card.Body>
                              <FaDumbbell
                                size={28}
                                className="text-danger mb-2"
                              />
                              <h6 className="fw-bold mb-0 text-white">
                                Today's Workout
                              </h6>
                              <p className="mb-0 text-white">
                                {/* {currentPlan.todayWorkout} */}
                                Push pull
                              </p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {!currentPlan && !loading && (
              <Row>
                <Col md={12}>
                  <p className="fs-2 font-bold text-white fw-bold">
                    No Plan selected, Select Plan To Begin new Journey
                  </p>
                  <Link to="/plans">
                    <Button className="bg-white text-black px-4 py-2 fs-4 rounded-pill fw-bold">
                      Begin Now
                    </Button>
                  </Link>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      )}

      {error && (
        <div className="w-100 flex flex-column justify-content-center align-items-center">
          <h1>Something Went Wrong</h1>
        </div>
      )}
    </>
  );
};
