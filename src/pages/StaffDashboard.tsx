import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getReservations, confirmReservation } from "../services/api";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const [reservations, setReservations] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await getReservations();
    setReservations(data.filter((r: any) => r.status === "pending"));
  };

  const handleConfirm = async (id: string) => {
    await confirmReservation(id);
    loadReservations();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/staff-login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Staff Dashboard</Typography>
        <Button variant="outlined" size="small" onClick={handleLogout}>
          Logout
        </Button>

        {reservations.length === 0 && (
          <Typography>Keine offenen Reservierungen.</Typography>
        )}

        <Stack spacing={2}>
          {reservations.map((r) => (
            <Card key={r.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography>
                  {r.name} – {r.date} {r.time}
                </Typography>
                <Typography variant="body2">
                  Personen: {r.people} | Pittermännchen: {r.pittermännchen}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() => handleConfirm(r.id)}
                >
                  Bestätigen
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
