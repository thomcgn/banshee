import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const [user, loading] = useAuthState(auth);

  if (loading) return null; // Loader optional

  if (!user) return <Navigate to="/staff-login" />;

  return children;
}
