import { useEffect, useState } from "react";

const useSocketManager = (
  isLoggedIn: boolean,
  authToken: string
): { socket: WebSocket | null } => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !authToken) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws?authToken=${authToken}`
    );
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [authToken, isLoggedIn]);

  return { socket };
};

export default useSocketManager;
