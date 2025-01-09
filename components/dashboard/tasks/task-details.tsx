"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
}

export function TaskDetails({ task, onBack }: TaskDetailsProps) {
  const priorityColors = {
    low: "bg-secondary text-secondary-foreground",
    medium: "bg-primary text-primary-foreground",
    high: "bg-destructive text-destructive-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <Badge className={priorityColors[task.priority]}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
          Priority
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-muted-foreground">{task.due_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time Remaining</p>
                <p className="text-muted-foreground">
                  {task.hours_remaining} hours
                </p>
              </div>
            </div>
          </div>

          {task.subtasks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subtasks</h3>
              <div className="space-y-3">
                {task.subtasks.map((subtask) => (
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
                        <Badge
                          className={cn(
                            "shrink-0",
                            priorityColors[subtask.priority]
                          )}
                        >
                          {subtask.hours_remaining}h
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
