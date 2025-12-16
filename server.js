/**
 * server.js
 * STARTEN MIT: node server.js
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

/* =========================
   Web Push Setup
========================= */
webpush.setVapidDetails(
  "mailto:admin@banshee.de",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/* =========================
   In-Memory Storage
   (für DEV – später DB)
========================= */
let reservations = [];
let subscriptions = [];

/* =========================
   ROUTES
========================= */

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ---------- Push Subscription ---------- */
app.post("/api/save-subscription", (req, res) => {
  const sub = req.body;

  if (!sub || !sub.endpoint) {
    return res.status(400).json({ error: "Ungültige Subscription" });
  }

  const exists = subscriptions.find(s => s.endpoint === sub.endpoint);
  if (!exists) {
    subscriptions.push(sub);
    console.log("🔔 Push-Subscription gespeichert");
  }

  res.status(201).json({ success: true });
});

/* ---------- Reservations ---------- */

// GET alle Reservierungen (Staff)
app.get("/api/reservations", (req, res) => {
  res.json(reservations);
});

// POST neue Reservierung (User)
app.post("/api/reservations", (req, res) => {
  const reservation = {
    id: reservations.length + 1,
    ...req.body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  reservations.push(reservation);

  // 🔔 Staff benachrichtigen
  notifyAll(
    "Neue Reservierung 🍻",
    `${reservation.name} am ${reservation.date} um ${reservation.time}`
  );

  res.status(201).json(reservation);
});

// PATCH bestätigen (Staff)
app.patch("/api/reservations/:id/confirm", async (req, res) => {
  const id = Number(req.params.id);
  const reservation = reservations.find(r => r.id === id);

  if (!reservation) {
    return res.status(404).json({ error: "Reservierung nicht gefunden" });
  }

  reservation.status = "confirmed";

  // 🔔 User benachrichtigen
  notifyAll(
    "Reservierung bestätigt ✅",
    `${reservation.name}, deine Reservierung am ${reservation.date} um ${reservation.time} wurde bestätigt.`
  );

  res.json(reservation);
});

/* =========================
   PUSH HELPER
========================= */
async function notifyAll(title, body) {
  const payload = JSON.stringify({
    title,
    body,
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("❌ Push Fehler, Subscription entfernt");
      subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
    }
  }
}

/* =========================
   START SERVER
========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log("🔥 RICHTIGER SERVER GESTARTET");
  console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
});
