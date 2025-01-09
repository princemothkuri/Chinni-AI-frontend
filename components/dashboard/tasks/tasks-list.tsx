"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "./task-card";
import { TaskDetails } from "./task-details";
import { Task } from "@/lib/types/dashboard";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { setAllFetchedTasks } from "@/lib/redux/features/dashboard/dashboardSlice";

// type Subtask = {
//   _id: string;
//   title: string;
//   description: string;
//   due_date: string;
//   priority: string;
//   hours_remaining: number;
// };

// type Task = {
//   _id: string;
//   title: string;
//   description: string;
//   due_date: string;
//   priority: string;
//   hours_remaining: number;
//   tags: string[];
//   subtasks: Subtask[];
// };

interface TasksListProps {
  searchQuery: string;
  selectedTags: string[];
}

export function TasksList({ searchQuery, selectedTags }: TasksListProps) {
  const dispatch = useDispatch();

  // const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const allTasks =
    useSelector((state: RootState) => state.dashBoard.allTasks) || [];

  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      task?.description?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      task?.subtasks.some(
        (subtask) =>
          subtask?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          subtask?.description
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase())
      );

    const matchesTags =
      selectedTags?.length === 0 ||
      selectedTags?.some((tag) => task?.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const selectedTask = allTasks.find((task) => task?._id === selectedTaskId);

  const handleViewDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleBack = () => {
    setSelectedTaskId(null);
  };

  const fetchUserTasksApi = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const rawData = response.data;

      const transformTasks = (data: any[]): Task[] => {
        const calculateHoursRemaining = (dueDate: string): number => {
          const now = new Date();
          const due = new Date(dueDate);
          const diff = due.getTime() - now.getTime();
          return Math.max(Math.ceil(diff / (1000 * 60 * 60)), 0); // Convert ms to hours
        };

        return data.map((task) => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          priority: task.priority,
          status: task.status,
          hours_remaining: calculateHoursRemaining(task.due_date),
          tags: task.tags || [],
          subtasks:
            task.subtasks.map((subtask: any) => ({
              _id: subtask._id,
              title: subtask.title,
              description: subtask.description,
              due_date: subtask.due_date,
              priority: subtask.priority,
              status: subtask.status,
              hours_remaining: calculateHoursRemaining(subtask.due_date),
            })) || [],
        }));
      };

      const formattedTasks = transformTasks(rawData);
      dispatch(setAllFetchedTasks(formattedTasks));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserTasksApi();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
          <TaskCard key={task._id} task={task} onViewDetails={handleViewDetails} />
        ))}
        {!searchQuery && filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-muted-foreground"
          >
            No tasks found!
          </motion.div>
        )}
        {searchQuery && filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-muted-foreground"
          >
            No tasks found matching your criteria
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
