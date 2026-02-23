import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const digilockerVerified = localStorage.getItem("digilockerVerified") === "true";
  const walletConnected = localStorage.getItem("walletConnected") === "true";

  if (!digilockerVerified) {
    return <Navigate to="/" replace />;
  }

  if (!walletConnected) {
    return <Navigate to="/metamask" replace />;
  }

  return children;
}

export default ProtectedRoute;
