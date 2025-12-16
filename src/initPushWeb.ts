// initPushWeb.ts
import { api } from "./services/api"; // Axios Instance

export const initPushWeb = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push wird vom Browser nicht unterstützt");
  }

  // Warte auf registrierten Service Worker
  const registration = await navigator.serviceWorker.ready;

  // Push-Subscription erstellen
  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
  });

  // Subscription ans Backend senden via Axios
  const res = await api.post("/save-subscription", sub);

  if (!res.data.success) throw new Error("Token konnte nicht erstellt werden");

  console.log("Web-Push Subscription gespeichert:", sub);
};

// Hilfsfunktion: VAPID-Key in Uint8Array umwandeln
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}
