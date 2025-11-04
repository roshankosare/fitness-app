import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/home";
import SignIn from "./pages/sing-in";
import SignUp from "./pages/sing-up";
import About from "./pages/about";
import Contact from "./pages/contact";
import Header from "./components/header/header";
import Plans from "./pages/plan";
import PlanInfo from "./pages/planInfo";
import AdminSignUp from "./pages/admin-sign-up";
import CreatePlan from "./pages/create-workout-plan";
import CreateWorkout from "./pages/create-workout";
import WeeklyPlanBuilder from "./pages/plan-builder";
import { AdminRoute } from "./components/protected-routes";
import { AuthProvider } from "./providers/authProvider";
import Dashboard from "./pages/dashboard";
import ManagePlans from "./pages/manage-plans";
import { ManageWorkouts } from "./pages/manage-workouts";
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Navbar */}
        <Header />
        <div className="d-flex flex-column min-vh-100 bg-black text-light">
          {/* Main Content */}
          <Container className="flex-grow-1 py-5 p-2">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup-admin" element={<AdminSignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/plans/:id" element={<PlanInfo />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/admin/create-plan"
                element={
                  <AdminRoute>
                    <CreatePlan />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/create-workout"
                element={
                  <AdminRoute>
                    <CreateWorkout />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/edit-workout/:id"
                element={
                  <AdminRoute>
                    <CreateWorkout />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/plan-builder/:planId"
                element={
                  <AdminRoute>
                    <WeeklyPlanBuilder />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/manage-plans"
                element={
                  <AdminRoute>
                    <ManagePlans />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-workouts"
                element={
                  <AdminRoute>
                    <ManageWorkouts />
                  </AdminRoute>
                }
              />
            </Routes>
          </Container>

          {/* Sticky Footer */}
          <footer className="bg-dark text-light text-center py-3 mt-auto border-top border-secondary">
            <Container>
              <p className="mb-0">
                © {new Date().getFullYear()} <strong>MyFitness</strong>. All
                rights reserved.
              </p>
            </Container>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
