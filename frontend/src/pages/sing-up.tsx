import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/sign-up",
        formData,
        {
          withCredentials: true, // ✅ ensures cookies are sent and stored
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        //redirect to dashboard
        navigate("/dashboard");
      }

      setMessage({ type: "success", text: "Account created successfully!" });
      setFormData({ fullName: "", email: "", password: "" });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError)
        setMessage({
          type: "danger",
          text: error.status === 500 ? "Internal server error" : error.message,
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
          <h3 className="text-center mb-4 fw-bold text-white">Sign Up</h3>

          {message && (
            <Alert variant={message.type} className="text-center fw-semibold">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Full Name */}
            <Form.Group controlId="formFullName" className="mb-3">
              <Form.Label className="text-white">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="bg-secondary text-white border-0"
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="text-white">Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-secondary text-white border-0"
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="text-white">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-secondary text-white border-0"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-semibold text-white"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-white">
              Already have an account?{" "}
              <a href="/signin" className="text-decoration-none text-white">
                Sign In
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
