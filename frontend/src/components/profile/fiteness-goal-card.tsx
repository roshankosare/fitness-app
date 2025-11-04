import { Card, Button } from "react-bootstrap";
import { FaDumbbell, FaRunning, FaHeartbeat } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FitnessGoalCardProps {
  goal?: string; // Example: "Lose 5kg", "Run 10km"// Callback for setting goal
}

const FitnessGoalCard: React.FC<FitnessGoalCardProps> = ({ goal }) => {
  return (
    <Card className="text-center shadow-sm border-0 rounded-4 p-3 bg-white">
      {goal ? (
        <>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
            <FaDumbbell size={32} className="text-primary" />
            <h5 className="fw-bold mb-0 text-dark">Your Fitness Goal</h5>
          </div>

          <Card.Body>
            <h4 className="text-success fw-bold mb-3">{goal}</h4>
            <p className="text-black mb-0">
              Stay strong and consistent — you're closer than you think!
            </p>
          </Card.Body>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
            <FaRunning size={32} className="text-danger" />
            <h5 className="fw-bold mb-0 text-dark fs-3">No Goal Set Yet</h5>
          </div>

          <Card.Body>
            <p className="text-black mb-3 fs-5">
              Push yourself, because no one else is going to do it for you.
            </p>
            {
              <Link to={"/profile"}>
                <Button variant="primary" className="fw-bold rounded-pill px-4">
                  <FaHeartbeat className="me-2" />
                  Set My Goal
                </Button>
              </Link>
            }
          </Card.Body>
        </>
      )}
    </Card>
  );
};

export default FitnessGoalCard;
