import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:4000/api/auth/sign-in", formData, {
        withCredentials: true, // ✅ allows cookies to be set by server
      });

      setMessage({
        type: "success",
        text: res.data.message || "Signed in successfully!",
      });
      setFormData({ email: "", password: "" });
      navigate("/dashboard");

      // Redirect or reload (optional)
      setTimeout(() => {
        window.location.href = "/"; // redirect to home
      }, 1000);
    } catch (error) {
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
        className="py-4 shadow-lg bg-dark"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-white">Sign In</h3>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="text-white">Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                className="bg-secondary text-white border-0"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="text-white">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                className="bg-secondary text-white border-0"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Check
                type="checkbox"
                label="Remember me"
                className="text-white"
              />
              <a href="#" className="text-decoration-none text-white">
                Forgot password?
              </a>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 fw-semibold text-white"
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-white">
              Don’t have an account?{" "}
              <a href="/signup" className="text-decoration-none text-white">
                Sign Up
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignIn;
