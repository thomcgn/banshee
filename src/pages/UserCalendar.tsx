import { useState} from "react";
import Calendar from "react-calendar";
import ReservationForm from "../components/ReservationForm";
import "react-calendar/dist/Calendar.css";
import { Container, Typography, Card, CardContent, Stack, Button, useTheme, useMediaQuery } from "@mui/material";
import { initPushWeb } from "../initPushWeb";
import { Link } from "react-router-dom";

export default function UserCalendar() {
  const [date, setDate] = useState<Date | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEnablePush = async () => {
    try {
      await initPushWeb();
      setPushEnabled(true);
      alert("Push aktiviert! Formular ist jetzt verfügbar.");
    } catch (err) {
      console.error("Push konnte nicht aktiviert werden:", err);
      alert("Push konnte nicht aktiviert werden.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2, px: isMobile ? 1 : 2, maxWidth: 360 }}>
      <Stack spacing={2}>
        <Typography variant={isMobile ? "h5" : "h4"}>Reservieren</Typography>

        <Button component={Link} to="/staff-login" variant="text" size="small">
          Staff Login
        </Button>

        {!pushEnabled && (
          <Button variant="outlined" size={isMobile ? "small" : "medium"} onClick={handleEnablePush}>
            🔔 Push Benachrichtigungen aktivieren
          </Button>
        )}

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: isMobile ? 1 : 2 }}>
            <Calendar
              onClickDay={(value) => setDate(value)}
              locale="de-DE"
              showNeighboringMonth={false}
              className="dark-calendar"
            />
          </CardContent>
        </Card>

        {pushEnabled && date && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <ReservationForm date={date} />
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
