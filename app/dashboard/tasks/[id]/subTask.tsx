import GreenTickCheckbox from "@/components/shared/green-tick-checkbox";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { SubTask } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const priorityColors = {
  low: "bg-secondary text-secondary-foreground hover:bg-secondary",
  medium: "bg-primary text-primary-foreground hover:bg-primary",
  high: "bg-destructive text-destructive-foreground hover:bg-destructive",
};

interface SubTaskProps {
  parentId: string;
  subtask: SubTask;
  handleDeleteSubTask: (subTaskId: string) => void;
}

const SubTaskComponent = ({ parentId, subtask, handleDeleteSubTask }: SubTaskProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(
    subtask?.status === "completed"
  );

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) return;
    try {
      setIsChecked(e.target.checked);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${parentId}/subtasks/${subtask._id}/status`,
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

  const handleDeleteTask = async () => {
    handleDeleteSubTask(subtask._id);
  }

  return (
    <Card key={subtask._id} className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-medium">{subtask.title}</h4>
            <p className="text-sm text-muted-foreground">
              {subtask.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{subtask.due_date}</span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-6">
            <Badge className={cn("shrink-0", priorityColors[subtask.priority])}>
              {subtask.hours_remaining}h
            </Badge>
            <div className="flex flex-row gap-6 items-center justify-center">
              <GreenTickCheckbox
                checked={isChecked}
                onChange={handleStatusChange}
              />
              <span
                className="text-destructive cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-6 w-6" />
              </span>
            </div>
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
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
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
  );
};

export default SubTaskComponent;
