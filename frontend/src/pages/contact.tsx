import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="text-light bg-dark min-vh-100">
      {/* Header Section */}
      <section className="py-5 text-center bg-black">
        <Container>
          <h1 className="fw-bold text-white mb-3">Contact Us</h1>
          <p className="text-light opacity-75">
            We'd love to hear from you! Reach out to us for support, feedback,
            or any inquiries.
          </p>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-5 bg-dark">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <h3 className="fw-bold mb-4 text-white">Send Us a Message</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write your message..."
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
                <Button variant="light" type="submit" className="fw-semibold">
                  Send Message
                </Button>
              </Form>
            </Col>

            <Col md={6}>
              <h3 className="fw-bold mb-4 text-white">Contact Information</h3>
              <Card className="bg-black text-light border-0 mb-4 p-3">
                <Card.Body>
                  <p>
                    <FaEnvelope className="me-2 text-info" />{" "}
                    support@fitnessapp.com
                  </p>
                  <p>
                    <FaPhone className="me-2 text-success" /> +91 98765 43210
                  </p>
                  <p>
                    <FaMapMarkerAlt className="me-2 text-danger" /> Lucknow,
                    Uttar Pradesh, India
                  </p>
                </Card.Body>
              </Card>

              <div className="ratio ratio-16x9 rounded shadow">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.9505645973423!2d80.9461593150405!3d26.846693883158257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2f1f9f3d99b%3A0xdeb3ec9af5a1b32e!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1696412388201!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
