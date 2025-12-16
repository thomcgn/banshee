import { useState } from "react";
import { postReservation } from "../services/api";
import { TextField, Button, Stack, Typography } from "@mui/material";

interface ReservationFormProps {
  date: Date;
}

export default function ReservationForm({ date }: ReservationFormProps) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("19:00");
  const [people, setPeople] = useState(1);
  const [pittermännchen, setPittermännchen] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const reservation = {
      date: date.toISOString().split("T")[0],
      time,
      name,
      people,
      pittermännchen,
      status: "pending",
    };

    try {
      const saved = await postReservation(reservation);
      console.log("Reservierung gespeichert:", saved);

      alert("Reservierung eingetragen! Staff muss noch bestätigen.");

      setName("");
      setTime("19:00");
      setPeople(1);
      setPittermännchen(0);
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern der Reservierung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="white">
          Reservierungsdetails
        </Typography>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
          fullWidth
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Uhrzeit"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          size="small"
          fullWidth
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Personenanzahl"
          type="number"
          min={1}
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          required
          size="small"
          fullWidth
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Anzahl Pittermännchen"
          type="number"
          min={0}
          value={pittermännchen}
          onChange={(e) => setPittermännchen(Number(e.target.value))}
          size="small"
          fullWidth
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Speichern..." : "Reservierung eintragen"}
        </Button>
      </Stack>
    </form>
  );
}
