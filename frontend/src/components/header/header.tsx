import { useState } from "react";
import { Navbar, Nav, Offcanvas, Container } from "react-bootstrap";
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
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-white text-dark rounded-pill px-3 py-1"
      : "text-white px-3 py-1";

  const mainLinks = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/about", label: "About Us", icon: <FaInfoCircle /> },
    { to: "/contact", label: "Contact", icon: <FaEnvelope /> },
    { to: "/plans", label: "Plans", icon: <FaDumbbell /> },
  ];

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="shadow-sm py-3 bg-dark"
      variant="dark"
    >
      <Container fluid className="px-3 px-md-5">
        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold text-white"
        >
          <span className="fs-2 bbh-sans-hegarty-regular">FitNest</span>
        </Navbar.Brand>

        {/* Mobile toggle (left aligned icon) */}
        <button
          onClick={handleShow}
          className="border-0 bg-transparent text-white d-lg-none"
          style={{ fontSize: "1.5rem" }}
          aria-label="Open Menu"
        >
          <FaBars />
        </button>

        {/* Desktop Navigation */}
        <div className="d-none d-lg-flex w-100 justify-content-between align-items-center">
          <Nav className="mx-auto d-flex align-items-center gap-3">
            {mainLinks.map((link) => (
              <Nav.Link
                key={link.to}
                as={Link}
                to={link.to}
                className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                  link.to
                )}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Nav.Link>
            ))}
          </Nav>

          {/* Auth Buttons (Desktop only) */}
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {!loading && !user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/signin"
                  className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                    "/signin"
                  )}`}
                >
                  <FaSignInAlt />
                  <span>Sign In</span>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup-admin"
                  className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                    "/signup-admin"
                  )}`}
                >
                  <FaSignInAlt />
                  <span>Be Admin</span>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                    "/dashboard"
                  )}`}
                >
                  DashBoard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={`d-flex align-items-center gap-2 fw-semibold 
                  `}
                >
                  <img
                    src="profile.png"
                    className=" rounded-circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      boxShadow: "0 0 4px 2px white",
                    }}
                  ></img>
                </Nav.Link>
                <Nav.Link
                  as="button"
                  onClick={logout}
                  className="d-flex align-items-center gap-2 fw-semibold bg-white text-black rounded-pill px-3 py-1"
                >
                  Sign Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </div>

        {/* Mobile Offcanvas Navigation (slides from left) */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          show={showOffcanvas}
          onHide={handleClose}
          className="bg-dark text-white d-lg-none"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title
              id="offcanvasNavbarLabel"
              className="d-flex align-items-center gap-2 text-white"
            >
              <FaDumbbell className="text-primary" />
              <span>MyApp Menu</span>
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="flex-column gap-3 text-white">
              {mainLinks.map((link) => (
                <Nav.Link
                  key={link.to}
                  as={Link}
                  to={link.to}
                  onClick={handleClose} // ✅ closes menu on click
                  className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                    link.to
                  )}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Nav.Link>
              ))}

              <hr className="border-secondary" />

              {!loading && !user ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/signin"
                    onClick={handleClose}
                    className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                      "/signin"
                    )}`}
                  >
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/signup-admin"
                    onClick={handleClose}
                    className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                      "/signup-admin"
                    )}`}
                  >
                    <FaSignInAlt />
                    <span>Be Admin</span>
                  </Nav.Link>
                </>
              ) : (
                <div className="d-flex justify-content-between">
                  <Nav.Link
                    as={Link}
                    to="/profile"
                    className={`d-flex align-items-center gap-2 fw-semibold ${isActive(
                      "/profile"
                    )}`}
                  >
                    <img
                      src="profile.png"
                      className=" rounded-circle"
                      style={{
                        width: "32px",
                        height: "32px",
                        boxShadow: "0 0 4px 2px white",
                      }}
                    ></img>
                    <span>Profile</span>
                  </Nav.Link>
                  <Nav.Link
                    as="button"
                    onClick={() => {
                      logout();
                      handleClose();
                    }}
                    className="d-flex align-items-center gap-2 text-white fw-semibold"
                  >
                    <FaSignInAlt />
                    <span>Sign Out</span>
                  </Nav.Link>
                </div>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
