import React, { createContext, useContext, useEffect } from "react";
import useSocketManager from "@/hooks/useSocketManager";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useAlarmListener } from "@/hooks/AlarmListener";
import { useTaskListener } from "@/hooks/TaskListener";
import {
  handleToggleActive,
  updateAlarm,
} from "@/lib/redux/features/dashboard/dashboardSlice";

interface iSocketContext {
  socket: WebSocket | null;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoggedIn, authToken } = useSelector(
    (state: RootState) => state.chinniMain
  );
  const { socket } = useSocketManager(isLoggedIn, authToken);
  const dispatch = useDispatch();

  const handleToggleAlarmWhenNotified = (data: any) => {
    if (data?.data?.next_alarm_time) {
      dispatch(
        updateAlarm({
          id: data?.data?.alarm_id,
          updatedData: { alarm_time: data?.data?.next_alarm_time },
        })
      );
    } else {
      dispatch(
        handleToggleActive({ id: data?.data?.alarm_id, isActive: false })
      );
    }
  };

  useAlarmListener(socket, handleToggleAlarmWhenNotified);
  useTaskListener(socket);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Granted permission!");
        }
      });
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      requestNotificationPermission();
    }
  }, [requestNotificationPermission]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }

  return context;
};
