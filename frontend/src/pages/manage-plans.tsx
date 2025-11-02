import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

type Plan = {
  id: string;
  name: string;
  description: string;
  bannerImage?: string | null;
  createdAt: string;
};

const ManagePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "danger";
  } | null>(null);
  const navigate = useNavigate();

  // ✅ Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/admin/plans`, {
        withCredentials: true,
      });
      setPlans(res.data.data || []);
    } catch (err) {
      if (err instanceof AxiosError)
        setMessage({
          text: err.response?.data?.message || "Failed to fetch plans.",
          type: "danger",
        });
    } finally {
      setLoading(false);
    }
  };

  //   // ✅ Delete a plan
  //   const deletePlan = async (id: string) => {
  //     if (!confirm("Are you sure you want to delete this plan?")) return;

  //     try {
  //       const res = await axios.delete(
  //         `${import.meta.env.VITE_API_URL}/api/admin/plans/${id}`,
  //         {
  //           withCredentials: true,
  //         }
  //       );

  //       if (res.status === 200) {
  //         setPlans((prev) => prev.filter((p) => p.id !== id));
  //         setMessage({ text: "Plan deleted successfully!", type: "success" });
  //       }
  //     } catch (err) {
  //       if (err instanceof AxiosError)
  //         setMessage({
  //           text: err.response?.data?.message || "Failed to delete plan.",
  //           type: "danger",
  //         });
  //     } finally {
  //       setTimeout(() => setMessage(null), 4000);
  //     }
  //   };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <Container
      className="py-5 text-white min-vh-100"
      style={{
        background: "linear-gradient(to bottom right, #0a0a0a, #1a1a1a)",
      }}
    >
      <h2 className="text-center mb-4 fw-bold">Manage Plans</h2>

      {message && (
        <Alert
          variant={message.type}
          className="text-center fw-semibold rounded-3 py-2"
        >
          {message.text}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <Spinner animation="border" variant="light" />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-center text-muted mt-4">No plans found.</p>
      ) : (
        <Table
          bordered
          hover
          responsive
          variant="dark"
          className="rounded-4 overflow-hidden"
        >
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Banner</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={plan.id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>
                  {plan.bannerImage ? (
                    <Image
                      src={
                        plan.bannerImage.startsWith("http")
                          ? plan.bannerImage
                          : `${import.meta.env.VITE_API_URL}${plan.bannerImage}`
                      }
                      alt={plan.name}
                      width={80}
                      height={50}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td>{plan.name}</td>
                <td className="text-truncate" style={{ maxWidth: "200px" }}>
                  {plan.description}
                </td>
                <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate(`/admin/plan-builder/${plan.id}`)}
                    >
                      View
                    </Button>
                    {/* <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deletePlan(plan.id)}
                    >
                      Delete
                    </Button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManagePlans;
