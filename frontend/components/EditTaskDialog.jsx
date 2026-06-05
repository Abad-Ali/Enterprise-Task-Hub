"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API = process.env.NEXT_PUBLIC_API_URI;

/* ================= FIELD COMPONENT ================= */
const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  form,
  onChange,
  hint,
}) => (
  <div className="flex flex-col gap-1">
    {/* LABEL */}
    <label
      htmlFor={name}
      className="text-xs tracking-wide text-zinc-400 uppercase flex justify-between"
    >
      <span>{label}</span>
    </label>

    {/* INPUT */}
    <Input
      id={name}
      name={name}
      type={type}
      value={form[name] ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500"
    />

    {/* HINT */}
    {hint && (
      <span className="text-[11px] text-zinc-500">{hint}</span>
    )}
  </div>
);

/* ================= EDIT TASK DIALOG ================= */
export default function EditTaskDialog({ task, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  /* sync task → form */
  useEffect(() => {
    if (!task) return;

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }, [task]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE TASK ================= */
  const updateTask = async () => {
    if (!task?._id) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `${API}/api/v1/task/${task._id}`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        onUpdated?.();
        setOpen(false);
      }
    } catch (err) {
      console.error("Task update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <DialogTrigger asChild>
        <Button className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
          Edit Task
        </Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="max-h-[85vh] md:max-h-[95vh] max-w-[95vw] sm:max-w-lg bg-zinc-950 text-white border border-zinc-800 rounded-2xl p-6 overflow-auto scrollable">

        {/* HEADER */}
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">
            Edit Task Details
          </DialogTitle>

          <p className="text-sm text-zinc-400">
            Update task information like title, description, priority, status, and due date.
          </p>
        </DialogHeader>

        {/* BODY */}
        <div className="mt-6 space-y-5">

          {/* TITLE */}
          <Field
            label="Task Title"
            name="title"
            placeholder="e.g. Fix login bug"
            form={form}
            onChange={onChange}
            hint="This is the main task title visible to everyone"
          />

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-wide text-zinc-400 uppercase">
              Task Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe what needs to be done..."
              className="w-full min-h-[120px] p-3 rounded-md bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <span className="text-[11px] text-zinc-500">
              Provide clear instructions for the employee
            </span>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PRIORITY */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase">
                Priority Level
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={onChange}
                className="p-2 rounded-md bg-zinc-900 border border-zinc-800"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical Priority</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase">
                Task Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="p-2 rounded-md bg-zinc-900 border border-zinc-800"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="under-review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* DUE DATE */}
          <Field
            label="Due Date"
            name="dueDate"
            type="date"
            form={form}
            onChange={onChange}
            hint="Deadline for completing this task"
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 border-zinc-700 hover:bg-zinc-800"
          >
            Cancel
          </Button>

          <Button
            onClick={updateTask}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-indigo-700 cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}