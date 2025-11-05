import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigation = useNavigate();

  useEffect(() => {
    navigation("/dashboard");
  }, [navigation]);

  return null;
};

export default AdminProfile;
