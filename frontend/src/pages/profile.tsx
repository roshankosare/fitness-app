import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminProfile from "../components/profile/admin-profile";
import UserProfile from "../components/profile/user-profile";
import { Container } from "react-bootstrap";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !user)
    return <p className="text-center text-light mt-5">Loading...</p>;
  return (
    <div className=" min-vh-100 text-white py-5 p-0">
      <Container className="d-flex flex-column gap-5 p-2 px-sm-5">

        {user.role === "ADMIN" ? <AdminProfile /> : <UserProfile />}
      </Container>
    </div>
  );
};

export default Profile;
