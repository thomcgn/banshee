self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Neue Nachricht";
  const options = {
    body: data.body || "",
    icon: "/icon.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // z. B. Homepage oder Dashboard
  );
});
