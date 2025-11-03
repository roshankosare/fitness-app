import { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";

const CreateWorkout = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL if exists
  const [preview, setPreview] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "danger";
  } | null>(null);

  // Fetch existing workout if ID is provided
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        if (!id) return;

        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/workouts/${id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success && res.data.data) {
          setExerciseName(res.data.data.exercise);
          setPreview(res.data.data.image); // Assuming backend returns image URL
        } else {
          setMessage({ text: "Workout not found.", type: "danger" });
        }
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError)
          setMessage({
            text:
              error.response?.data?.message ||
              "Failed to load workout details.",
            type: "danger",
          });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!exerciseName || (!imageFile && !id)) {
      setMessage({ text: "Please fill in all fields.", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("exercise", exerciseName);
      if (imageFile) formData.append("image", imageFile);

      const url = id
        ? `http://localhost:4000/api/workouts/${id}`
        : `http://localhost:4000/api/workouts`;
      const method = id ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage({
          text: id
            ? "Workout updated successfully!"
            : "Workout created successfully!",
          type: "success",
        });

        if (!id) {
          setExerciseName("");
          setPreview(null);
          setImageFile(null);
        }
      } else {
        setMessage({
          text: id ? "Failed to update workout." : "Failed to create workout.",
          type: "danger",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError)
        setMessage({
          text:
            error.response?.data?.message ||
            (id
              ? "Something went wrong while updating the workout."
              : "Something went wrong while creating the workout."),
          type: "danger",
        });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(to bottom right, #0a0a0a, #1a1a1a)",
      }}
    >
      <Card
        text="white"
        className="py-4 px-3 shadow-lg bg-dark border-0 rounded-4"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-white">
            {id ? "Update Workout" : "Create Workout"}
          </h3>

          {message && (
            <Alert
              variant={message.type}
              className="text-center fw-semibold rounded-3 py-2"
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exerciseName" className="mb-3">
              <Form.Label className="text-white">Exercise Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exercise name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                required
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
            </Form.Group>

            <Form.Group controlId="exerciseImage" className="mb-4">
              <Form.Label className="text-white">Exercise Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
              {preview && (
                <div className="mt-3 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-3 shadow-sm"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Button
              disabled={loading}
              className="w-100 bg-white px-5 rounded-5 py-2 text-black fw-semibold"
            >
              {loading
                ? id
                  ? "Updating..."
                  : "Creating..."
                : id
                ? "Update Workout"
                : "Create Workout"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateWorkout;
