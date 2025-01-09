"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlarmsList } from "@/components/dashboard/alarms/alarms-list";
import { TasksList } from "@/components/dashboard/tasks/tasks-list";
import { AddButton } from "@/components/dashboard/add-button";
import { AddAlarmModal } from "@/components/dashboard/modals/add-alarm-modal";
import { AddTaskModal } from "@/components/dashboard/modals/add-task-modal";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  appendAlarm,
  appendTask,
  setDefaultNavigation,
} from "@/lib/redux/features/dashboard/dashboardSlice";
import { Task } from "@/lib/types/dashboard";

interface DashboardTabsProps {
  searchQuery: string;
  selectedTags: string[];
  setActiveTab: (value: string) => void;
  setIsAddAlarmOpen: (value: boolean) => void;
  setIsAddTaskOpen: (value: boolean) => void;
  isAddAlarmOpen: boolean;
  isAddTaskOpen: boolean;
}

interface AlarmFormData {
  description: string;
  time: string; // Use "string" if it's in ISO or time format; otherwise, Date type for actual date objects
  priority: "normal" | "medium" | "high"; // Priority options
  recurrence: "none" | "daily" | "weekly" | "monthly"; // Recurrence options
}

export function DashboardTabs({
  searchQuery,
  selectedTags,
  setActiveTab,
  setIsAddAlarmOpen,
  setIsAddTaskOpen,
  isAddAlarmOpen,
  isAddTaskOpen,
}: DashboardTabsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const { defaultNavigation } = useSelector(
    (state: RootState) => state.dashBoard
  );

  const [alarmFormData, setAlarmFormData] = useState<AlarmFormData>({
    description: "",
    time: "",
    priority: "normal",
    recurrence: "none",
  });

  const handleAddAlarm = async (data: any) => {
    if (!isLoggedIn) return;
    // Here you would typically make an API call to add the alarm
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms`,
        {
          alarm_time: data.time,
          description: data.description,
          repeat_pattern: data.recurrence,
          priority: data.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response?.status === 200) {
        dispatch(appendAlarm(response?.data?.newAlarm));
        toast({
          title: "Alarm Added",
          description: "Your alarm has been successfully created.",
        });
        setLoading(false);
        setIsAddAlarmOpen(false);
        setAlarmFormData({
          description: "",
          time: "",
          priority: "normal",
          recurrence: "none",
        });
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to save your alarm. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to save your alarm. Please try again.",
      });
    }
  };

  const formatDate = (date: string): string => {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString().padStart(2, "0"); // Ensure 2 digits for day
    const month = parsedDate.toLocaleString("en-US", { month: "long" });
    const year = parsedDate.getFullYear();
    const hours = parsedDate.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = parsedDate.getMinutes().toString().padStart(2, "0"); // Ensure 2 digits for minutes
    const ampm = parsedDate.getHours() >= 12 ? "PM" : "AM";

    // Return the correctly formatted date
    return `${day} ${month}, ${hours}:${minutes} ${ampm} ${year}`;
  };

  const handleAddTask = async (data: any) => {
    if (!isLoggedIn) return;
    // Here you would typically make an API call to add the alarm
    try {
      setLoading(true);

      data.due_date = formatDate(data.due_date);

      if (Array.isArray(data.subtasks)) {
        data.subtasks = data.subtasks.map((subtask: any) => {
          if (subtask.due_date) {
            subtask.due_date = formatDate(subtask.due_date);
          }
          return subtask;
        });
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response?.status === 200) {
        const transformTask = (task: any): Task => {
          const calculateHoursRemaining = (dueDate: string): number => {
            const now = new Date();
            const due = new Date(dueDate);
            const diff = due.getTime() - now.getTime();
            return Math.max(Math.ceil(diff / (1000 * 60 * 60)), 0); // Convert ms to hours
          };

          return {
            _id: task._id,
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            priority: task.priority,
            status: task.status,
            hours_remaining: calculateHoursRemaining(task.due_date),
            tags: task.tags || [],
            subtasks: task.subtasks
              ? task.subtasks.map((subtask: any) => ({
                _id: subtask._id,
                title: subtask.title,
                description: subtask.description,
                due_date: subtask.due_date,
                priority: subtask.priority,
                status: subtask.status,
                hours_remaining: calculateHoursRemaining(subtask.due_date),
              }))
              : [],
          };
        };

        const formattedTasks = transformTask(response?.data?.task_data);
        dispatch(appendTask(formattedTasks));
        toast({
          title: "Task Added",
          description: "Your task has been successfully created.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to save your task. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to save your task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs
      defaultValue={defaultNavigation ? defaultNavigation : "alarms"}
      className="space-y-4"
      onValueChange={(value) => setActiveTab(value)}
    >
      <div className="flex justify-center items-center">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="alarms" onClick={() => { dispatch(setDefaultNavigation("alarms")) }}>Alarms</TabsTrigger>
          <TabsTrigger value="tasks" onClick={() => { dispatch(setDefaultNavigation("tasks")) }}>Tasks</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="alarms" className="space-y-4">
        <AlarmsList searchQuery={searchQuery} selectedTags={selectedTags} />
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <TasksList searchQuery={searchQuery} selectedTags={selectedTags} />
      </TabsContent>

      <AddAlarmModal
        isOpen={isAddAlarmOpen}
        onClose={() => setIsAddAlarmOpen(false)}
        onSubmit={handleAddAlarm}
        formData={alarmFormData}
        setFormData={setAlarmFormData}
        loading={loading}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
      />
    </Tabs>
  );
}
