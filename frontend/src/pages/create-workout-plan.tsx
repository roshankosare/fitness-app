import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const CreatePlan = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !description || !bannerImage) {
      setError("Please fill all fields and upload a banner image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("bannerImage", bannerImage);

      // ✅ Adjust API URL as needed (use env variable)
      const res = await axios.post(
        `http://localhost:4000/api/admin/plans`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        navigate(`/admin/plan-builder/${res.data.data.id}`);
      }

      setSuccess("Workout Plan Created Successfully!");
      setName("");
      setDescription("");
      setBannerImage(null);
      setPreview(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Error creating plan:", err);
        setError(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center min-vh-100 p-0"
      style={{
        background: "linear-gradient(to bottom right, #0a0a0a, #1a1a1a)",
      }}
    >
      <Card
        text="white"
        className="py-4 px-1 shadow-lg bg-dark border-0 rounded-4"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-white">
            Create Workout Plan
          </h3>

          {/* ✅ Alert Messages */}
          {error && (
            <Alert variant="danger" className="text-center fw-semibold">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="text-center fw-semibold">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Plan Name */}
            <Form.Group controlId="planName" className="mb-3">
              <Form.Label className="text-white-50">Plan Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter plan name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                "Create Plan"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePlan;
