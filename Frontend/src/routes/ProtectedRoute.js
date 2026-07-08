import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles, forbiddenRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userRole = user?.role;

  if (allowedRoles && (!user || !allowedRoles.includes(userRole))) {
    return <Navigate to="/403" replace />;
  }

  if (forbiddenRoles && user && forbiddenRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
