import { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";

const CreatePlan = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add logic to send form data to API
    alert("Workout Plan Created Successfully!");
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
            Create Workout Plan
          </h3>

          <Form onSubmit={handleSubmit}>
            {/* Plan Name */}
            <Form.Group controlId="planName" className="mb-3">
              <Form.Label className="text-white-50">Plan Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter plan name"
                required
                className="bg-secondary text-white border-0 rounded-3"
              />
            </Form.Group>

            {/* Description */}
            <Form.Group controlId="planDescription" className="mb-3">
              <Form.Label className="text-white-50">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write a short description..."
                required
                className="bg-secondary text-white border-0 rounded-3"
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId="planImage" className="mb-4">
              <Form.Label className="text-white-50">Banner Image</Form.Label>
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
              className="w-100 fw-semibold text-white py-2 rounded-3"
            >
              Create Plan
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePlan;
