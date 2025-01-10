import { useEffect } from "react";
import formatRelativeDate from "./DateTimeFormat";

export const useAlarmListener = (
  socket: WebSocket | null,
  handleToggleAlarmWhenNotified: (data: any) => void
) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "alarm_notification") {
          handleToggleAlarmWhenNotified(data);
          if ("Notification" in window) {
            const bodyContent = `Alarm:\nDescription: ${
              data.data.description
            }\nTime: ${formatRelativeDate(data.data.time)}`;

            const notification = new Notification("ChinniAI", {
              body: bodyContent,
              requireInteraction: true,
              // icon: "path-to-icon"
            });

            notification.onclick = () => {
              // alert(bodyContent);
              window.open(`https://chinni-ai.vercel.app/dashboard`, "_blank");
            };
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);
};
