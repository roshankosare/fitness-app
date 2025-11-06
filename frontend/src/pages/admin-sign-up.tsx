import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    secretKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { refetchToggle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/sign-up/admin",
        formData,
        {
          withCredentials: true, // ✅ allows browser to store cookies set by the server
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage({
        type: "success",
        text: res.data.message || "Admin account created successfully!",
      });
      setFormData({ fullName: "", email: "", password: "", secretKey: "" });

      // rediredct
      refetchToggle();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError)
        setMessage({
          type: "danger",
          text:
            error.status === 500
              ? "Internal server error"
              : "Invalid email or password",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center px-0">
      <Card
        text="white"
        className="py-4 shadow-lg bg-dark px-2"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-white">Admin Sign Up</h3>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFullName" className="mb-3">
              <Form.Label className="text-white">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-transparent text-white border-1 border-white rounded-4"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="text-white">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent text-white border-1 border-white rounded-4"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="text-white">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent text-white border-1 border-white rounded-4"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSecretKey" className="mb-4">
              <Form.Label className="text-white">Secret Key</Form.Label>
              <Form.Control
                type="text"
                name="secretKey"
                placeholder="Enter admin secret key"
                value={formData.secretKey}
                onChange={handleChange}
                className="bg-transparent text-white border-1 border-white rounded-4"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 bg-white px-5 rounded-5 py-2 text-black fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />{" "}
                  Signing Up...
                </>
              ) : (
                "Sign Up as Admin"
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-white">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-decoration-none text-white fw-semibold"
              >
                Sign In
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminSignUp;
