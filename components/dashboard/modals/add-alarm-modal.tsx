"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AlarmFormData {
  description: string;
  time: string; // Use "string" if it's in ISO or time format; otherwise, Date type for actual date objects
  priority: "normal" | "medium" | "high"; // Priority options
  recurrence: "none" | "daily" | "weekly" | "monthly"; // Recurrence options
}

interface AddAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlarmFormData) => void;
  formData: AlarmFormData;
  setFormData: React.Dispatch<React.SetStateAction<AlarmFormData>>;
  loading: boolean;
}

export function AddAlarmModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
}: AddAlarmModalProps) {
  const [errors, setErrors] = useState({
    time: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      time: "",
    };

    if (!formData.time) {
      newErrors.time = "Select the date and time";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check your input and try again.",
      });
      return;
    }
    onSubmit(formData);
    setErrors({
      time: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Alarm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter alarm description"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Date & Time</Label>
            <Input
              id="time"
              type="datetime-local"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              disabled={loading}
            />
            {errors.time && (
              <p className="text-sm text-destructive">{errors.time}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  priority: value as "normal" | "medium" | "high",
                })
              }
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
            <Label htmlFor="recurrence">Recurrence</Label>
            <Select
              value={formData.recurrence}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  recurrence: value as "none" | "daily" | "weekly" | "monthly",
                })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Add Alarm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
