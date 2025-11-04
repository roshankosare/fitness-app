import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { Button, Form, Card, Container } from "react-bootstrap";
import Error from "../error";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProfileUpdatedMessage, setShowProfileUpdatedMessage] =
    useState<boolean>(false);
  const [userData, setUserData] = useState({
    goal: "",
    fullName: "",
    email: "",
    age: 0,
    weightKg: 0,
    heightCm: 0,
  });
  console.log(userData);

  // Simulate fetching user data from server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user-profile", {
          withCredentials: true,
        });

        if (res.data.data) {
          setUserData({
            goal: res.data.data.userProfile.goal || "",
            fullName: res.data.data.fullName || "",
            email: res.data.data.email || "",
            age: res.data.data.userProfile.age || 0,
            weightKg: res.data.data.userProfile.weightKg || 0,
            heightCm: res.data.data.userProfile.heightCm || 0,
          });
          return;
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save (integrate with your API here)
  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:4000/api/user-profile",
        {
          userData,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log("updated");

        setShowProfileUpdatedMessage(true);
        setTimeout(() => {
          setShowProfileUpdatedMessage(false);
        }, 2000);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(true);
      }
    }

    setIsEditing(false);
  };

  if (loading) return null;

  if (!loading && error) return <Error />;

  return (
    <Container className="d-flex flex-column gap-2 justify-content-center align-items-center px-0">
      {showProfileUpdatedMessage && (
        <p className="px-4 py-2 bg-white text-black rounded-pill">
          Profile Updated
        </p>
      )}
      <Card
        text="white"
        className="py-4 shadow-lg bg-dark px-2 px-sm-5 mt-5"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <h4 className="text-center mb-4">Profile</h4>

        <Form>
          {/* Full Name */}

          <Form.Group className="mb-3 w-100">
            <Form.Label>Current Goal</Form.Label>
            <Form.Control
              type="text"
              placeholder="add your goal here"
              name="goal"
              value={userData.goal}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              disabled={!isEditing}
              className="bg-transparent text-white border-1 border-white rounded-4"
            />
          </Form.Group>
          <div className="d-flex flex-column flex-sm-row  gap-4 w-100 mb-4">
            <Form.Group className="mb-3 w-100">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                disabled={!isEditing}
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3 w-100">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                disabled={!isEditing}
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
            </Form.Group>
          </div>

          {/* Age */}

          <div className="d-flex flex-column flex-sm-row  gap-4 mb-4">
            <Form.Group className="mb-3 w-100">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={userData.age}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                disabled={!isEditing}
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
            </Form.Group>

            {/* Weight */}
            <Form.Group className="mb-3 w-100">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                name="weightKg"
                value={userData.weightKg}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                disabled={!isEditing}
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
            </Form.Group>

            {/* Height */}
            <Form.Group className="mb-4 w-100">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                name="heightCm"
                value={userData.heightCm}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                disabled={!isEditing}
                className="bg-transparent text-white border-1 border-white rounded-4"
              />
            </Form.Group>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            {isEditing ? (
              <>
                <Button
                  className="bg-white px-5 rounded-5 py-2 text-black fw-semibold"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  className="bg-white px-5 rounded-5 py-2 text-black fw-semibold"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                className="bg-white px-5 rounded-5 py-2 text-black fw-semibold"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default UserProfile;
