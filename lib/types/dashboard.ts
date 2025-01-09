export interface Alarm {
  _id: string;
  description: string;
  repeat_pattern: "none" | "daily" | "weekly" | "monthly";
  priority: "normal" | "medium" | "high";
  alarm_time: string;
  is_active: boolean;
  tags: string[];
  created_at: string;
}

export interface SubTask {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  status: string;
  hours_remaining: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  status: string;
  hours_remaining: number;
  tags: string[];
  subtasks: SubTask[];
}
