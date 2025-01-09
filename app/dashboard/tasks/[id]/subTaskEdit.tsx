import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { SubTask } from '@/lib/types/dashboard';

interface SubTaskProps {
    // parentId: string;
    subtask: SubTask;
    onChange: (updatedSubtask: SubTask) => void;
    onDelete: (subtaskId: string) => void;
    loading: boolean;
}

const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString.replace(",", ""));
    if (isNaN(date.getTime())) return "";

    // Adjust for local timezone
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localDate = new Date(date.getTime() - tzOffset);

    const formattedDate = localDate.toISOString().slice(0, 16);
    return formattedDate;
};

const SubTaskEdit = ({ subtask, onChange, onDelete, loading }: SubTaskProps) => {
    const [formData, setFormData] = useState<SubTask>(subtask);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        due_date: "",
    });

    useEffect(() => {
        setFormData(subtask);
    }, [subtask]);

    const handleChange = (field: keyof SubTask, value: any) => {
        const updatedSubtask = { ...formData, [field]: value };
        setFormData(updatedSubtask);
        onChange(updatedSubtask);
        validateField(field, value);
    };

    const validateField = (field: keyof SubTask, value: any) => {
        let error = "";
        if (!value) {
            error = `Please enter the ${field}`;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg relative">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-destructive"
                onClick={() => onDelete(subtask._id)}
                disabled={loading}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    onBlur={(e) => validateField("title", e.target.value)}
                    placeholder="Subtask title"
                    disabled={loading}
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    onBlur={(e) => validateField("description", e.target.value)}
                    placeholder="Subtask description"
                    disabled={loading}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                    type="datetime-local"
                    value={formData.due_date ? formatDateForInput(formData.due_date) : ""}
                    onChange={(e) => handleChange("due_date", e.target.value)}
                    onBlur={(e) => validateField("due_date", e.target.value)}
                    disabled={loading}
                />
                {errors.due_date && (
                    <p className="text-sm text-destructive">{errors.due_date}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high") => handleChange("priority", value)}
                    disabled={loading}
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
    );
};

export default SubTaskEdit;