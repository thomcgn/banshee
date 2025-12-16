import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  persons: number;
  pitter: number;
  status: "pending" | "confirmed" | "declined";
}

export default function AdminPanel() {
  const [list, setList] = useState<Reservation[]>([]);

  const load = async () => {
    const res = await api.get<Reservation[]>("/reservations");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (id: string, type: "confirm" | "decline") => {
    await api.put(`/reservations/${id}/${type}`);
    load();
  };

  return (
    <div>
      <h2>Admin – Reservierungen</h2>

      {list.map((r) => (
        <div key={r.id}>
          <b>{r.name}</b> | {r.date} {r.time} | <b>{r.status}</b>

          {r.status === "pending" && (
            <>
              <button onClick={() => action(r.id, "confirm")}>✔</button>
              <button onClick={() => action(r.id, "decline")}>✖</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
