"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { describe } from "node:test";
import { toast } from "@/hooks/use-toast";

interface SubTask {
  title: string;
  description: string;
  due_date: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddTaskModal({ isOpen, onClose, onSubmit }: AddTaskModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    due_date: string;
    status: "pending" | "completed";
    priority: "low" | "medium" | "high";
    subtasks: SubTask[];
  }>({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    priority: "medium",
    subtasks: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const [subtaskErrors, setSubtaskErrors] = useState<
    { title: string; description: string; due_date: string }[]
  >([]);

  const addSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [
        ...formData.subtasks,
        {
          title: "",
          description: "",
          due_date: "",
          status: "pending",
          priority: "medium",
        },
      ],
    });
  };

  const removeSubtask = (index: number) => {
    const newSubtasks = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const updateSubtask = (
    index: number,
    field: keyof SubTask,
    value: string
  ) => {
    const newSubtasks = formData.subtasks.map((subtask, i) => {
      if (i === index) {
        return { ...subtask, [field]: value };
      }
      return subtask;
    });
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const validateForm = () => {
    let isValid = true;

    const newErrors = {
      title: "",
      description: "",
      due_date: "",
    };

    // Validate main task fields
    if (!formData.title) {
      newErrors.title = "Please enter the title";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Please enter the description";
      isValid = false;
    }

    if (!formData.due_date) {
      newErrors.due_date = "Select the date and time";
      isValid = false;
    }

    // Validate subtasks
    const newSubtaskErrors = formData.subtasks.map((subtask) => {
      const subtaskErrors = { title: "", description: "", due_date: "" };
      if (!subtask.title) {
        subtaskErrors.title = "Please enter the subtask title";
        isValid = false;
      }
      if (!subtask.description) {
        subtaskErrors.description = "Please enter the subtask description";
        isValid = false;
      }
      if (!subtask.due_date) {
        subtaskErrors.due_date = "Select the subtask due date and time";
        isValid = false;
      }
      return subtaskErrors;
    });
    setErrors({ ...newErrors });
    setSubtaskErrors(newSubtaskErrors);

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    onClose();
    setErrors({
      title: "",
      description: "",
      due_date: "",
    });
    setFormData({
      title: "",
      description: "",
      due_date: "",
      status: "pending",
      priority: "medium",
      subtasks: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date & Time</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
            />
            {errors.due_date && (
              <p className="text-sm text-destructive">{errors.due_date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setFormData({ ...formData, priority: value })
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
            {formData.subtasks.map((subtask, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border rounded-lg relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-destructive"
                  onClick={() => removeSubtask(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={subtask.title}
                    onChange={(e) =>
                      updateSubtask(index, "title", e.target.value)
                    }
                    placeholder="Subtask title"
                  />
                  {subtaskErrors[index]?.title && (
                    <p className="text-sm text-destructive">
                      {subtaskErrors[index].title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={subtask.description}
                    onChange={(e) =>
                      updateSubtask(index, "description", e.target.value)
                    }
                    placeholder="Subtask description"
                  />
                  {subtaskErrors[index]?.description && (
                    <p className="text-sm text-destructive">
                      {subtaskErrors[index].description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="datetime-local"
                    value={subtask.due_date}
                    onChange={(e) =>
                      updateSubtask(index, "due_date", e.target.value)
                    }
                  />
                  {subtaskErrors[index]?.due_date && (
                    <p className="text-sm text-destructive">
                      {subtaskErrors[index].due_date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={subtask.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      updateSubtask(index, "priority", value)
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
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addSubtask}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {formData.subtasks.length === 0
                ? "Add Subtask"
                : "Add Another Subtask"}
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
