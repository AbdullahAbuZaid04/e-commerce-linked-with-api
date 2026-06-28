import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles, forbiddenRoles }) => {
  const { user } = useAuth();

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/403" replace />;
  }

  if (forbiddenRoles && user && forbiddenRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
