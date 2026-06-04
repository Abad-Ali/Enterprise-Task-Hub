"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = process.env.NEXT_PUBLIC_API_URI;

export default function EditTaskDialog({ task, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  // sync task → form
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    }
  }, [task]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${API}/api/v1/task/${task._id}`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        onUpdated?.(); // refresh list in parent
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button (your edit button replaces this usage) */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Task title"
            className="bg-white/5 border-white/10"
          />

          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Task description"
            className="bg-white/5 border-white/10"
          />

          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
            className="w-full p-2 rounded bg-white/5 border border-white/10"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
            className="bg-white/5 border-white/10"
          />

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-green-500/20 text-green-300 hover:bg-green-500/30"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}