import type { UserPlan } from "@prisma/client";
import { Card, Row, Col } from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaDumbbell } from "react-icons/fa";
import type { UserProgress, WeekDay } from "../../types";
import TodaysPlanInfo from "./today-plan-info";

type Props = {
  currentPlan: UserPlan & { progress: UserProgress };
  weekDay?: WeekDay;
};
export const PlanProgress: React.FC<Props> = ({ currentPlan, weekDay }) => {
  const startDate = new Date(currentPlan?.startDate);
  const today = new Date();
  const planHasStarted = startDate <= today;

  // Optional: format date nicely
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  if (!planHasStarted) {
    // 🟡 Show fallback card if plan hasn’t started yet
    return (
      <Card className="border-0 shadow-sm rounded-4 text-center py-4 mt-4 bg-dark">
        <Card.Body>
          <h5 className="fw-bold text-white mb-2">Plan not started yet</h5>
          <p className="text-white-50 mb-0">
            Your plan will start from <strong>{formattedStartDate}</strong>.
          </p>
        </Card.Body>
      </Card>
    );
  }

  // ✅ Show progress UI if plan has started
  return (
    <Row className="mt-4 g-3">
      {/* Week */}
      <Col xs={6} md={3}>
        <Card className="border-0 shadow-sm rounded-4 text-center py-3">
          <Card.Body>
            <FaCalendarAlt size={28} className="text-success mb-2" />
            <h6 className="fw-bold mb-0 text-white">Week</h6>
            <p className="mb-0 text-white">
              {currentPlan?.progress?.current?.weekNumber ?? "-"}
            </p>
          </Card.Body>
        </Card>
      </Col>

      {/* Day */}
      <Col xs={6} md={3}>
        <Card className="border-0 shadow-sm rounded-4 text-center py-3">
          <Card.Body>
            <FaClock size={28} className="text-warning mb-2" />
            <h6 className="fw-bold mb-0 text-white">Day</h6>
            <p className="mb-0 text-white">
              {currentPlan?.progress?.current?.day ?? "-"}
            </p>
          </Card.Body>
        </Card>
      </Col>

      {/* Today's Workout */}
      <Col xs={12} md={6}>
        <Card className="border-0 shadow-sm rounded-4 text-center py-3">
          <Card.Body>
            <FaDumbbell size={28} className="text-danger mb-2" />
            <h6 className="fw-bold mb-0 text-white">Today's Workout</h6>
            <p className="mb-0 text-white">
              {currentPlan?.progress?.weeks?.[0]?.days?.find(
                (d) => d.day === currentPlan?.progress?.current?.day
              )?.workoutName ?? "Rest Day"}
            </p>
          </Card.Body>
        </Card>
      </Col>

      <TodaysPlanInfo weekDay={weekDay} />
    </Row>
  );
};
