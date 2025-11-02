import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

type Workout = {
  id: string;
  exercise: string;
  image?: string | null;
  createdAt: string;
  date?: string;
};

export const ManageWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "danger";
  } | null>(null);
  const navigate = useNavigate();

  /** ✅ Fetch all workouts */
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/workouts`, {
        withCredentials: true,
      });
      setWorkouts(res.data.data || []);
    } catch (err) {
      if (err instanceof AxiosError)
        setMessage({
          text: err.response?.data?.message || "Failed to fetch workouts.",
          type: "danger",
        });
    } finally {
      setLoading(false);
    }
  };

  /** ❌ Delete a workout */
  const deleteWorkout = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/workouts/${id}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
        setMessage({ text: "Workout deleted successfully!", type: "success" });
      }
    } catch (err) {
      if (err instanceof AxiosError)
        setMessage({
          text: err.response?.data?.message || "Failed to delete workout.",
          type: "danger",
        });
    } finally {
      setTimeout(() => setMessage(null), 4000);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <Container
      className="py-5 text-white min-vh-100"
      style={{
        background: "linear-gradient(to bottom right, #0a0a0a, #1a1a1a)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-white">Manage Workouts</h2>
        <Button
          variant="success"
          className="fw-semibold"
          onClick={() => navigate("/admin/create-workout")}
        >
          ➕ Create Workout
        </Button>
      </div>

      {message && (
        <Alert
          variant={message.type}
          className="text-center fw-semibold rounded-3 py-2"
        >
          {message.text}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <Spinner animation="border" variant="light" />
        </div>
      ) : workouts.length === 0 ? (
        <p className="text-center text-muted mt-4">No workouts found.</p>
      ) : (
        <Table
          bordered
          hover
          responsive
          variant="dark"
          className="rounded-4 overflow-hidden"
        >
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Image</th>
              <th>Exercise</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout, index) => (
              <tr key={workout.id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>
                  {workout.image ? (
                    <Image
                      src={
                        workout.image.startsWith("http")
                          ? workout.image
                          : `${import.meta.env.VITE_API_URL}${workout.image}`
                      }
                      alt={workout.exercise}
                      width={80}
                      height={50}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td className="fw-semibold">{workout.exercise}</td>
                <td>{new Date(workout.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate(`/admin/create-workout`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteWorkout(workout.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
