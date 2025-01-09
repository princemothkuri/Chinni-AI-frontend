import GreenTickCheckbox from "@/components/shared/green-tick-checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/lib/redux/store";
import { SubTask } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const hoursRemainingColors = (hours: number) => {
  if (hours > 48) {
    return "bg-secondary text-secondary-foreground hover:bg-secondary";
  } else if (hours > 24) {
    return "bg-primary text-primary-foreground hover:bg-primary";
  } else {
    return "bg-destructive text-destructive-foreground hover:bg-destructive";
  }
};

interface SubTaskProps {
  parentTaskId: string;
  subtask: SubTask;
  isHovered: boolean;
}

const SubTaskCard = ({ parentTaskId, subtask, isHovered }: SubTaskProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(
    subtask?.status === "completed"
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    // Format the date
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // Format the time
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format
    });

    return `${formattedDate}, ${formattedTime}`;
  };

  useEffect(() => {
    setIsChecked(subtask?.status === "completed");
  }, [subtask]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) return;
    try {
      setIsChecked(e.target.checked);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${parentTaskId}/subtasks/${subtask._id}/status`,
        { new_status: e.target.checked ? "completed" : "pending" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      key={subtask._id}
      className="bg-muted/50 backdrop-blur-sm border transition-colors group-hover:border-primary/30"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-medium group-hover:text-primary transition-colors">
              {subtask.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {subtask?.description
                ? subtask?.description
                : "No description..."}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{subtask.due_date}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-end">
            <Badge
              className={cn(
                "shrink-0",
                hoursRemainingColors(subtask.hours_remaining)
              )}
            >
              {subtask.hours_remaining}h
            </Badge>
            <AnimatePresence>
              {isHovered && (
                <div className="flex flex-row gap-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.05 }}
                    exit={{ scale: 0 }}
                    className="flex items-center"
                  >
                    <GreenTickCheckbox
                      checked={isChecked}
                      onChange={handleStatusChange}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.2 }}
                    animate={{ scale: 1.4 }}
                    exit={{ scale: 0.2 }}
                    className="flex items-center"
                  >
                    <span
                      className="text-destructive cursor-pointer"
                      onClick={() =>
                        setShowDeleteDialog(true)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subTask.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              // onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SubTaskCard;
