import { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import axios, { AxiosError } from "axios";

const CreateWorkout = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "danger";
  } | null>(null);

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

    if (!exerciseName || !imageFile) {
      setMessage({ text: "Please fill in all fields.", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("exercise", exerciseName);
      formData.append("image", imageFile);

      const res = await axios.post(
        `http://localhost:4000/api/workouts`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setMessage({ text: "Workout created successfully!", type: "success" });
        setExerciseName("");
        setPreview(null);
        setImageFile(null);
      } else {
        setMessage({ text: "Failed to create workout.", type: "danger" });
      }
    } catch (error) {
      if (error instanceof AxiosError)
        setMessage({
          text:
            error.response?.data?.message ||
            "Something went wrong while creating the workout.",
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
            Create Workout
          </h3>

          {/* Message at top */}
          {message && (
            <Alert
              variant={message.type}
              className="text-center fw-semibold rounded-3 py-2"
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Exercise Name */}
            <Form.Group controlId="exerciseName" className="mb-3">
              <Form.Label className="text-white-50">Exercise Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exercise name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                required
                className="bg-secondary text-white border-0 rounded-3"
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId="exerciseImage" className="mb-4">
              <Form.Label className="text-white-50">Exercise Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-secondary text-white border-0 rounded-3 p-2"
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
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 fw-semibold text-white py-2 rounded-3"
            >
              {loading ? "Creating..." : "Create Workout"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateWorkout;
