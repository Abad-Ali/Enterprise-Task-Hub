"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";

export default function TasksPage() {
  const user = useSelector((state) => state.auth.user);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTask, setActiveTask] = useState(null);
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState("");

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/v1/task/my`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ================= GREETING =================
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // ================= STATS =================
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (t) => t.status !== "completed"
  ).length;

  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== "completed" &&
      new Date(t.dueDate) < new Date()
  ).length;

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // ================= SUBMIT TASK =================
  const submitTask = async (taskId) => {
    if (!note.trim() && !attachment.trim()) {
      alert("Please add a submission note or attachment.");
      return;
    }

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/v1/task/${taskId}/submit`,
        {
          submissionNote: note,
          attachments: attachment ? [attachment] : [], // ✅ FIXED
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? res.data.task : t
          )
        );

        setActiveTask(null);
        setNote("");
        setAttachment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const canSubmit = note.trim() || attachment.trim();

  return (
    <div className="min-h-screen text-white px-6 py-8 pt-25 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* GREETING */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold">
            {greeting},{" "}
            <span className="text-blue-400">
              {user?.name || "Employee"}
            </span>
          </h1>

          <p className="text-white/60 mt-3">
            Manage and complete your assigned tasks.
          </p>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <p className="mt-10 text-white/60">Loading tasks...</p>
        )}

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
          {[
            {
              title: "Total Tasks",
              value: totalTasks,
              icon: ClipboardList,
              color: "text-blue-400",
            },
            {
              title: "Pending Tasks",
              value: pendingTasks,
              icon: Clock3,
              color: "text-orange-400",
            },
            {
              title: "Completed Tasks",
              value: completedTasks,
              icon: CheckCircle2,
              color: "text-green-400",
            },
            {
              title: "Overdue Tasks",
              value: overdueTasks,
              icon: AlertTriangle,
              color: "text-red-400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <item.icon className={item.color} />
              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>
              <p className="text-white/60">{item.title}</p>
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Progress Overview
          </h2>

          <div className="w-full bg-white/10 h-3 rounded-full">
            <div
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="mt-3 text-white/60">
            {completedTasks} / {totalTasks} completed
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {completionRate}%
          </h3>
        </div>

        {/* TASK LIST */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Your Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <ClipboardList className="w-10 h-10 mx-auto text-white/40 mb-3" />
              <p className="text-xl font-semibold">
                No tasks to show
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {tasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <h3 className="text-xl font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-white/60 text-sm mt-1">
                    {task.description}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <span className="px-3 py-1 text-xs bg-white/10 rounded-full">
                      {task.priority}
                    </span>

                    <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm text-white/50 mt-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
  
                    <div className="text-xs sm:text-sm text-white/60">
                      Assigned by{" "}
                      <span className="text-white font-medium">
                        @{task?.assignedBy?.username || "unknown"}
                      </span>
                    </div>
                  
                    {/* RIGHT → action button */}
                    <button
                      onClick={() => setActiveTask(task)}
                      className="px-3 sm:px-4 py-2 bg-white text-black rounded-lg text-xs sm:text-sm font-medium hover:scale-[1.02] transition flex items-center gap-1"
                    >
                      Open Submit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL */}
        {activeTask && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-lg">

              <h2 className="text-xl font-semibold">
                {activeTask.title}
              </h2>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write submission note..."
                className="w-full mt-4 p-3 bg-white/5 border border-white/10 rounded-lg scrollable"
              />

              <input
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                placeholder="Attachment link (Drive, GitHub, etc.)"
                className="w-full mt-3 p-3 bg-white/5 border border-white/10 rounded-lg text-sm"
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => {
                    setActiveTask(null);
                    setNote("");
                    setAttachment("");
                  }}
                  className="px-4 py-2 bg-white/10 rounded-lg"
                >
                  Cancel
                </button>

                {canSubmit && (
                  <button
                    onClick={() => submitTask(activeTask._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                  >
                    <Send size={16} />
                    Submit
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}