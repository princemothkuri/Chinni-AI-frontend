"use client";

import { useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronDown, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import GreenTickCheckbox from "@/components/shared/green-tick-checkbox";
import SubTaskCard from "./sub-task-card";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "@/hooks/use-toast";
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
import { deleteTask } from "@/lib/redux/features/dashboard/dashboardSlice";

interface TaskCardProps {
  task: Task;
  onViewDetails: (taskId: string) => void;
}

const MotionCard = motion(
  forwardRef<HTMLDivElement, any>((props, ref) => <div ref={ref} {...props} />)
);
MotionCard.displayName = "MotionCard";

const MotionContent = motion(
  forwardRef<HTMLDivElement, any>((props, ref) => <div ref={ref} {...props} />)
);
MotionContent.displayName = "MotionContent";

export function TaskCard({ task, onViewDetails }: TaskCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(
    task?.status === "completed"
  );

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const priorityColors = {
    low: "bg-secondary text-secondary-foreground hover:bg-secondary",
    medium: "bg-primary text-primary-foreground hover:bg-primary",
    high: "bg-destructive text-destructive-foreground hover:bg-destructive",
  };

  const hoursRemainingColors = (hours: number) => {
    if (hours > 48) {
      return "bg-secondary text-secondary-foreground hover:bg-secondary py-1 px-2 rounded-xl";
    } else if (hours > 24) {
      return "bg-primary text-primary-foreground hover:bg-primary py-1 px-2 rounded-xl";
    } else {
      return "bg-destructive text-destructive-foreground hover:bg-destructive py-1 px-2 rounded-xl";
    }
  };

  useEffect(() => {
    setIsChecked(task?.status === "completed");
    console.log(task);
  }, [task]);

  const handleTaskStatus = async (e: any) => {
    if (!isLoggedIn) return;
    setIsChecked(e.target.checked);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${task?._id}/status`,
        { new_status: e.target.checked ? "completed" : "pending" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/tasks/${task._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response);

      if (response?.status === 200) {
        dispatch(deleteTask({ id: task._id }));
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
      setShowDeleteDialog(false);
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-2 transition-colors duration-300 group-hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
              {task?.title}
            </CardTitle>
            <Badge
              className={cn(
                priorityColors[task?.priority],
                "transition-colors"
              )}
            >
              {task?.priority.charAt(0).toUpperCase() + task?.priority.slice(1)}{" "}
              Priority
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {task?.description ? task?.description : "No description..."}
          </p>

          <div className="flex flex-row justify-between text-sm">
            <div className="flex flex-wrap gap-4 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>{task?.due_date}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2",
                  hoursRemainingColors(task?.hours_remaining)
                )}
              >
                <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>{task?.hours_remaining}h remaining</span>
              </div>
            </div>
            <AnimatePresence>
              {isHovered && (
                <div className="flex flex-row gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.05 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2 pr-3"
                  >
                    <GreenTickCheckbox
                      checked={isChecked}
                      onChange={handleTaskStatus}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.4 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2 pr-3"
                  >
                    <span
                      className="text-destructive cursor-pointer"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {task?.subtasks.length > 0 && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between group-hover:text-primary transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span>Subtasks ({task?.subtasks.length})</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>

              <AnimatePresence>
                {isExpanded && (
                  <MotionContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3">
                      {task?.subtasks.map((subtask) => (
                        <SubTaskCard
                          parentTaskId={task?._id}
                          subtask={subtask}
                          isHovered={isHovered}
                        />
                      ))}
                    </div>
                  </MotionContent>
                )}
              </AnimatePresence>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full group-hover:border-primary/50 group-hover:text-primary transition-colors"
            onClick={() => router.push(`/dashboard/tasks/${task?._id}`)}
          >
            View Details
          </Button>
        </CardContent>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={false}
          animate={{
            boxShadow: isHovered
              ? "0 0 20px rgba(var(--primary), 0.2)"
              : "0 0 0px rgba(var(--primary), 0)",
          }}
          transition={{ duration: 0.2 }}
        /> */}
      </Card>
    </MotionCard>
  );
}
