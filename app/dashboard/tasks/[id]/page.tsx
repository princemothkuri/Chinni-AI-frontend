"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { deleteTask } from "@/lib/redux/features/dashboard/dashboardSlice";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SubTaskComponent from "./subTask";
import SubTaskEdit from "./subTaskEdit";
import { Task, SubTask } from "@/lib/types/dashboard";
import axios from "axios";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [subtaskErrors, setSubtaskErrors] = useState<
    { title: string; description: string; due_date: string }[]
  >([]);

  const dispatch = useDispatch();

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const fetchTaskApi = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const rawData = response.data;
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
      const formattedTasks = transformTask(rawData);
      setTask(formattedTasks);
      setEditedTask(formattedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!params.id || !isLoggedIn) {
      setTask(null);
      return;
    }

    fetchTaskApi(params.id);
  }, [params.id]);

  if (!task) {
    return (
      <div className="max-h-full flex justify-center items-center">
        Task not found
      </div>
    );
  }

  const priorityColors = {
    low: "bg-secondary text-secondary-foreground hover:bg-secondary",
    medium: "bg-primary text-primary-foreground hover:bg-primary",
    high: "bg-destructive text-destructive-foreground hover:bg-destructive",
  };

  const handleDeleteTask = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${task._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response?.status === 200) {
        dispatch(deleteTask({ id: task._id }));
        router.push("/dashboard");
        toast({
          title: "Task Deleted",
          description: "The task has been permanently deleted.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unable to Delete the Task!",
          description: `Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Unable to Delete the Task!",
        description: `Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteSubTask = async (subTaskId: string) => {

    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${params.id}/subtasks/${subTaskId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response?.status === 200) {
        //   dispatch(deleteTask({ id: subtask._id }));
        // router.push("/dashboard");
        setTask((prev) => {
          if (!prev) return null;
          const updatedSubtasks = prev.subtasks.filter(
            (subtask) => subtask._id !== subTaskId
          );
          return { ...prev, subtasks: updatedSubtasks };
        });
        toast({
          title: "Sub-Task Deleted",
          description: "The sub-task has been permanently deleted.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unable to Delete the Sub-Task!",
          description: `Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Unable to Delete the Sub-Task!",
        description: `Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => {
      if (!prev) return null;

      const updated: Task = { ...prev, [field]: value };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(task));
      return updated;
    });
  };

  const handleSubtaskChange = (index: number, updatedSubtask: SubTask) => {
    setEditedTask((prev) => {
      if (!prev) return null;

      const updatedSubtasks = prev.subtasks.map((subtask, i) =>
        i === index ? updatedSubtask : subtask
      );
      const updated: Task = { ...prev, subtasks: updatedSubtasks };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(task));
      return updated;
    });
  };

  const handleSubtaskDelete = (index: number) => {
    setEditedTask((prev) => {
      if (!prev) return null;

      const updatedSubtasks = prev.subtasks.filter((_, i) => i !== index);
      const updated: Task = { ...prev, subtasks: updatedSubtasks };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(task));
      return updated;
    });
  };

  const addSubtask = () => {
    setEditedTask((prev) => {
      if (!prev) return null;

      const newSubtask: SubTask = {
        _id: "",
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "pending",
        hours_remaining: 0,
      };
      const updated: Task = { ...prev, subtasks: [...prev.subtasks, newSubtask] };
      setHasChanges(true);
      return updated;
    });
  };

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString.replace(",", ""));
    if (isNaN(date.getTime())) return "";

    // Adjust for local timezone
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localDate = new Date(date.getTime() - tzOffset);

    const formattedDate = localDate.toISOString().slice(0, 16);
    return formattedDate;
  };

  const formatDateForBackend = (localDateTime: string): string => {
    const date = new Date(localDateTime);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const validateField = (field: keyof Task, value: any) => {
    let error = "";
    if (!value) {
      error = `Please enter the ${field}`;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const validateSubtasks = () => {
    let isValid = true;
    const newSubtaskErrors = editedTask?.subtasks.map((subtask) => {
      const subtaskErrors = { title: "", description: "", due_date: "" };
      if (!subtask.title) {
        subtaskErrors.title = "Please enter the title";
        isValid = false;
      }
      if (!subtask.description) {
        subtaskErrors.description = "Please enter the description";
        isValid = false;
      }
      if (!subtask.due_date) {
        subtaskErrors.due_date = "Select the date and time";
        isValid = false;
      }
      return subtaskErrors;
    });
    setSubtaskErrors(newSubtaskErrors || []);
    return isValid;
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

  const handleUpdate = async () => {
    if (!isLoggedIn || !editedTask) return;

    const isValid = validateForm();
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check your input and try again.",
      });
      return;
    }

    let editedTaskAfterDateFormat = { ...editedTask };

    if (!/^\d{2} \w+, \d{2}:\d{2} [AP]M \d{4}$/.test(editedTask.due_date)) {
      editedTaskAfterDateFormat.due_date = formatDate(editedTask.due_date);
    }

    editedTaskAfterDateFormat.subtasks = editedTask.subtasks.map((subtask) => {
      if (!/^\d{2} \w+, \d{2}:\d{2} [AP]M \d{4}$/.test(subtask.due_date)) {
        return { ...subtask, due_date: formatDate(subtask.due_date) };
      }
      return subtask;
    });

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${params.id}`,
        editedTaskAfterDateFormat,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response?.status === 200) {
        setTask(editedTaskAfterDateFormat);
        fetchTaskApi(params.id);
        setIsEditing(false);
        setHasChanges(false);
        toast({
          title: "Task Updated",
          description: "The task has been successfully updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Unable to update the task. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Unable to update the task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", description: "", due_date: "" };

    if (!editedTask?.title) {
      newErrors.title = "Please enter the title";
      isValid = false;
    }

    if (!editedTask?.description) {
      newErrors.description = "Please enter the description";
      isValid = false;
    }

    if (!editedTask?.due_date) {
      newErrors.due_date = "Select the date and time";
      isValid = false;
    }

    setErrors(newErrors);
    const areSubtasksValid = validateSubtasks();
    return isValid && areSubtasksValid;
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background via-background/50 to-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex gap-6 md:gap-0 md:items-center md:justify-between flex-col md:flex-row">
            <div className="flex items-start gap-4 flex-col md:flex-row md:items-center">
              {!isEditing && (
                <>
                  <div className="flex flex-row items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push("/dashboard")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold md:max-w-md">
                      {task.title}
                    </h2>
                  </div>
                  <Badge className={priorityColors[task.priority]}>
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}{" "}
                    Priority
                  </Badge>
                </>
              )}
            </div>
            <div className="flex flex-row gap-6 items-center md:justify-center">
              {isEditing ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTask(task);
                      setHasChanges(false);
                    }}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleUpdate}
                    disabled={loading || !hasChanges}
                    className={cn("text-primary", !hasChanges && "opacity-50")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setEditedTask(task);
                    }}
                  >
                    <Pencil className="h-6 w-6" />
                  </span>
                  <span
                    className="text-destructive cursor-pointer"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-6 w-6" />
                  </span>
                </>
              )}
            </div>
          </div>

          <Card>
            {isEditing ? (
              <>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Title</h3>
                    <Input
                      value={editedTask?.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Task title"
                      className="bg-background/50"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Description</h3>
                    <Textarea
                      value={editedTask?.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Task description"
                      className="bg-background/50"
                      disabled={loading}
                    />
                  </div>

                  <div className="max-w-[230px]">
                    <h3 className="text-lg font-semibold">Due Date & Time</h3>
                    <Input
                      type="datetime-local"
                      value={
                        editedTask?.due_date
                          ? formatDateForInput(editedTask.due_date)
                          : ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "due_date",
                          e.target.value
                        )
                      }
                      className="bg-background/50"
                      disabled={loading}
                    />
                  </div>

                  <div className="max-w-[230px]">
                    <h3 className="text-lg font-semibold">Priority</h3>
                    <Select
                      value={editedTask?.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        handleChange("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Subtasks</h3>
                    {editedTask?.subtasks.map((subtask, index) => (
                      <SubTaskEdit
                        key={index}
                        subtask={subtask}
                        onChange={(updatedSubtask) =>
                          handleSubtaskChange(index, updatedSubtask)
                        }
                        onDelete={() => handleSubtaskDelete(index)}
                        loading={loading}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSubtask}
                      className="w-full"
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {editedTask?.subtasks.length === 0
                        ? "Add Subtask"
                        : "Add Another Subtask"}
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-muted-foreground">{task.description}</p>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{task.due_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{task.hours_remaining} hours remaining</span>
                  </div>
                </div>

                {task.subtasks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Subtasks</h3>
                    <div className="space-y-3">
                      {task.subtasks.map((subtask) => (
                        <SubTaskComponent
                          key={subtask._id}
                          parentId={task._id}
                          subtask={subtask}
                          handleDeleteSubTask={handleDeleteSubTask}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTask}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={loading}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
