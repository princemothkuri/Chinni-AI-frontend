import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alarm, Task } from "@/lib/types/dashboard";
import { set } from "date-fns";

interface chinniMainState {
  allAlarms: Alarm[];
  allTasks: Task[];
  defaultNavigation: "alarms" | "tasks";
}

const initialState: chinniMainState = {
  allAlarms: [],
  allTasks: [],
  defaultNavigation: "alarms",
};

export const dashboardSlice = createSlice({
  name: "DashBoard",
  initialState,
  reducers: {
    setAllFetchedAlarms: (state, action: PayloadAction<Alarm[]>) => {
      state.allAlarms = action.payload;
    },
    appendAlarm: (state, action: PayloadAction<Alarm>) => {
      state.allAlarms = [action.payload, ...state.allAlarms];
    },
    handleToggleActive: (
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      const { id, isActive } = action.payload;
      if (state.allAlarms.length === 0) return;
      const alarmIndex = state.allAlarms.findIndex((alarm) => alarm._id === id);

      if (alarmIndex !== -1) {
        state.allAlarms[alarmIndex] = {
          ...state.allAlarms[alarmIndex],
          is_active: isActive,
        };
      }
    },
    deleteAlarm: (state, action: PayloadAction<{ id: string }>) => {
      state.allAlarms = state.allAlarms.filter(
        (alarm) => alarm._id !== action.payload.id
      );
    },
    updateAlarm: (
      state,
      action: PayloadAction<{ id: string; updatedData: Partial<Alarm> }>
    ) => {
      const { id, updatedData } = action.payload;
      const alarmIndex = state.allAlarms.findIndex((alarm) => alarm._id === id);

      if (alarmIndex !== -1) {
        state.allAlarms[alarmIndex] = {
          ...state.allAlarms[alarmIndex],
          ...updatedData,
        };
      }
    },
    setAllFetchedTasks: (state, action: PayloadAction<Task[]>) => {
      state.allTasks = action.payload;
    },
    appendTask: (state, action: PayloadAction<Task>) => {
      state.allTasks = [action.payload, ...state.allTasks];
    },
    deleteTask: (state, action: PayloadAction<{ id: string }>) => {
      state.allTasks = state.allTasks.filter(
        (task) => task._id !== action.payload.id
      );
    },
    setDefaultNavigation: (
      state,
      action: PayloadAction<"alarms" | "tasks">
    ) => {
      state.defaultNavigation = action.payload;
    },
    dashboardSliceReset: () => initialState,
  },
});

export const {
  dashboardSliceReset,
  setAllFetchedAlarms,
  handleToggleActive,
  appendAlarm,
  deleteAlarm,
  updateAlarm,
  setAllFetchedTasks,
  appendTask,
  deleteTask,
  setDefaultNavigation,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
