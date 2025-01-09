import { useEffect } from "react";
import formatRelativeDate from "./DateTimeFormat";

export const useTaskListener = (socket: WebSocket | null) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "task_notification") {
          if ("Notification" in window) {
            let bodyContent;
            let fullContent;
            if (data.data?.subtask) {
              const subTaskTimeDate = formatRelativeDate(
                data.data?.subtask?.due_date
              );
              bodyContent = `Task Notification:\nTitle: ${data.data?.title}\nSub-Task:\n\tTitle: ${data.data?.subtask?.title}\n\tDue-Date: ${subTaskTimeDate}\n\tPriority: ${data.data?.subtask?.priority}\n\tHours-Remaining: ${data.data?.subtask?.hours_remaining}`;

              fullContent = `Task Notification:\n\nTitle: ${data.data?.title}\nDescription: ${data.data?.description}\n\nSub-Task:\n\tTitle: ${data.data?.subtask?.title}\n\tDescription: ${data.data?.subtask?.description}\n\tDue-Date: ${subTaskTimeDate}\n\tPriority: ${data.data?.subtask?.priority}\n\tHours-Remaining: ${data.data?.subtask?.hours_remaining}\n`;
            } else {
              const parentTaskTimeDate = formatRelativeDate(
                data.data?.due_date
              );

              bodyContent = `Task Notification:\nTitle: ${data.data?.title}\nDue-Date: ${parentTaskTimeDate}\nPriority: ${data.data?.priority}\nHours-Remaining: ${data.data?.hours_remaining}`;

              fullContent = `Task Notification:\n\nTitle: ${data.data?.title}\nDescription: ${data.data?.description}\nDue-Date: ${parentTaskTimeDate}\nPriority: ${data.data?.priority}\nHours-Remaining: ${data.data?.hours_remaining}\n`;
            }
            const notification = new Notification("ChinniAI", {
              body: bodyContent,
              requireInteraction: true,
              // icon: "path-to-icon"
            });

            notification.onclick = () => {
              // alert(fullContent);
              window.open("http://localhost:3000/dashboard", "_blank");
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
