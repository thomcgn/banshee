import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserCalendar from "./pages/UserCalendar";
import StaffDashboard from "./pages/StaffDashboard";
import StaffLogin from "./pages/StaffLogin";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserCalendar />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
