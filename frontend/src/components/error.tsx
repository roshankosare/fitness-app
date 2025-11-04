import React from "react";
import { Card, Container } from "react-bootstrap";

type Props = {
  message?: string;
};

const Error: React.FC<Props> = ({ message }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center px-0">
      <Card
        text="white"
        className="py-4 shadow-lg bg-dark px-2 px-sm-5 mt-5"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        {message && <h1 className="fw-bold">{message}</h1>}
        {!message && <h1 className="fw-bold">Something went wrong</h1>}
      </Card>
    </Container>
  );
};

export default Error;
