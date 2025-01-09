"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, Trash2, Edit2, X, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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
import { Alarm } from "@/lib/types/dashboard";
import { cn, getPriorityColor, priorityColors } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAlarm,
  handleToggleActive,
  updateAlarm,
} from "@/lib/redux/features/dashboard/dashboardSlice";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { RootState } from "@/lib/redux/store";
import { Label } from "@/components/ui/label";

interface AlarmCardProps {
  alarm: Alarm;
}

const MotionCard = motion(
  forwardRef<HTMLDivElement, any>((props, ref) => <Card ref={ref} {...props} />)
);
MotionCard.displayName = "MotionCard";

export function AlarmCard({ alarm }: AlarmCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedAlarm, setEditedAlarm] = useState(alarm);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleAlarmLoading, setToggleAlarmLoading] = useState(false);

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const dispatch = useDispatch();

  const handleToggle = async (checked: boolean) => {
    if (!isLoggedIn) return;
    setToggleAlarmLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms/${alarm._id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response?.status === 200) {
        toast({
          title: checked ? "Alarm Activated" : "Alarm Deactivated",
          description: `The alarm has been ${checked ? "activated" : "deactivated"
            }.`,
        });
        dispatch(handleToggleActive({ id: alarm?._id, isActive: checked }));
      } else {
        toast({
          title: checked
            ? "Unable to Activate the Alarm!"
            : "Unable to Deactivate the Alarm!",
          description: `Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: checked
          ? "Unable to Activate the Alarm!"
          : "Unable to Deactivate the Alarm!",
        description: `Please try again.`,
        variant: "destructive",
      });
    } finally {
      setToggleAlarmLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms/${alarm._id}`,
        {
          alarm_time: editedAlarm.alarm_time,
          description: editedAlarm.description,
          repeat_pattern: editedAlarm.repeat_pattern,
          priority: editedAlarm.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response?.status === 200) {
        toast({
          title: "Alarm Updated",
          description: "The alarm has been successfully updated.",
        });
        dispatch(
          updateAlarm({
            id: alarm._id,
            updatedData: {
              ...editedAlarm,
              alarm_time: editedAlarm.alarm_time + ":00+05:30",
              is_active: true,
            },
          })
        );
        setIsEditing(false);
        setHasChanges(false);
      } else {
        toast({
          title: "Unable to Update the Alarm!",
          description: `Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Unable to Update the Alarm!",
        description: `Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlarm = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms/${alarm._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response?.status === 200) {
        dispatch(deleteAlarm({ id: alarm._id }));
        toast({
          title: "Alarm Deleted",
          description: "The alarm has been permanently deleted.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unable to Delete the Alarm!",
          description: `Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Unable to Delete the Alarm!",
        description: `Please try again.`,
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleChange = (field: keyof Alarm, value: any) => {
    setEditedAlarm((prev) => {
      const updated = { ...prev, [field]: value };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(alarm));
      return updated;
    });
  };

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      // whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <MotionCard className="overflow-hidden bg-card/50 backdrop-blur-sm border-2 transition-colors duration-300 group-hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={editedAlarm.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Alarm description"
                      className="bg-background/50"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={editedAlarm.alarm_time.slice(0, 16)}
                      onChange={(e) => handleChange("alarm_time", e.target.value)}
                      className="bg-background/50"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={editedAlarm.priority}
                      onValueChange={(value) => handleChange("priority", value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Recurrence</Label>
                    <Select
                      value={editedAlarm.repeat_pattern}
                      onValueChange={(value) =>
                        handleChange("repeat_pattern", value)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select repeat pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">
                      {formatDateTime(alarm.alarm_time)}
                    </span>
                    <Badge
                      className={cn("ml-2", priorityColors[alarm.priority])}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {alarm.priority.charAt(0).toUpperCase() +
                        alarm.priority.slice(1)}{" "}
                      Priority
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {alarm?.description
                      ? alarm.description
                      : "No description..."}
                  </p>
                  {alarm.repeat_pattern !== "none" && (
                    <Badge variant="secondary">
                      Repeats {alarm.repeat_pattern}
                    </Badge>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Created-At: {formatDateTime(alarm.created_at)}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {!isEditing && (
                <Switch
                  checked={alarm.is_active}
                  onCheckedChange={handleToggle}
                  className={cn("transition-all duration-200")}
                  disabled={toggleAlarmLoading}
                />
              )}


              <AnimatePresence>
                {(isHovered || isEditing) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedAlarm(alarm);
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
                          className={cn(
                            "text-primary",
                            !hasChanges && "opacity-50"
                          )}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setShowDeleteDialog(true)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </motion.div>
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
                alarm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAlarm}
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
      </MotionCard>
    </motion.div>
  );
}
