import axios from "axios";

// Axios Instance
export const api = axios.create({
  baseURL: "/api", // Vite Proxy leitet automatisch an http://localhost:5000
});

// GET Reservations
export const getReservations = async () => {
  const res = await api.get("/reservations");
  return res.data;
};

// POST Reservation
export const postReservation = async (reservation: any) => {
  const res = await api.post("/reservations", reservation);
  return res.data;
};

// PATCH Reservation bestätigen
export const confirmReservation = async (id: string) => {
  const res = await api.patch(`/reservations/${id}/confirm`);
  return res.data;
};
