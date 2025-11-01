import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaBars,
  FaDumbbell,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path ? "text-primary" : "text-white-50";

  const mainLinks = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/about", label: "About Us", icon: <FaInfoCircle /> },
    { to: "/contact", label: "Contact", icon: <FaEnvelope /> },
    { to: "/plans", label: "Plans", icon: <FaDumbbell /> },
  ];

  return (
    <Navbar
      bg="black"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm px-3 w-100"
    >
      <div className="container-fluid px-2 px-md-4">
        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold text-white"
        >
          <FaDumbbell size={20} color="#0d6efd" />
          <span>MyApp</span>
        </Navbar.Brand>

        {/* Toggle (mobile) */}
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          className="border-0 p-1 d-lg-none text-white"
          style={{ fontSize: "1.2rem" }}
        >
          <FaBars />
        </Navbar.Toggle>

        {/* Desktop Nav */}
        <Nav className="mx-auto d-none d-lg-flex align-items-center gap-3">
          {mainLinks.map((link) => (
            <Nav.Link
              key={link.to}
              as={Link}
              to={link.to}
              className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                link.to
              )}`}
            >
              {link.icon} {link.label}
            </Nav.Link>
          ))}
        </Nav>

        {/* Right-side Auth Buttons */}
        <Nav className="ms-auto d-none d-lg-flex align-items-center gap-3">
          {!loading && !user ? (
            <>
              <Nav.Link
                as={Link}
                to="/signin"
                className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                  "/signin"
                )}`}
              >
                <FaSignInAlt /> Sign In
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/signup"
                className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                  "/signup"
                )}`}
              >
                <FaSignInAlt /> Sign Up
              </Nav.Link>
            </>
          ) : (
            <Nav.Link
              as="button"
              onClick={logout}
              className="d-flex align-items-center gap-2 fw-semibold"
            >
               Sign Out
            </Nav.Link>
          )}
        </Nav>

        {/* Mobile Sidebar */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          className="bg-black text-white d-lg-none"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title
              id="offcanvasNavbarLabel"
              className="d-flex align-items-center gap-2"
            >
              <FaDumbbell color="#0d6efd" />
              MyApp Menu
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="flex-column gap-3">
              {mainLinks.map((link) => (
                <Nav.Link
                  key={link.to}
                  as={Link}
                  to={link.to}
                  className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                    link.to
                  )}`}
                >
                  {link.icon} {link.label}
                </Nav.Link>
              ))}

              <hr className="border-secondary" />

              {!loading && !user ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/signin"
                    className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                      "/signin"
                    )}`}
                  >
                    <FaSignInAlt /> Sign In
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/signup"
                    className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                      "/signup"
                    )}`}
                  >
                    <FaSignInAlt /> Sign Up
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  as="button"
                  onClick={logout}
                  className="d-flex align-items-center gap-2 text-danger fw-semibold"
                >
                   Sign Out
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </div>
    </Navbar>
  );
}
