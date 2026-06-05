"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  Inbox,
  CalendarDays,
  User,
  UserCog,
  Flag,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
} from "lucide-react";

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
import EditTaskDialog from "@/components/EditTaskDialog";
// import { Inbox } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URI;

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("assign");
  const [loading, setLoading] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  const [expandedTask, setExpandedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/api/v1/task/all`, {
      withCredentials: true,
    });
    setTasks(res.data.tasks || []);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/api/v1/user/`, {
      withCredentials: true,
    });
    setEmployees(res.data.users || []);
  };

  const createTask = async () => {
    if (!form.title || !form.assignedTo) return alert("Fill required fields");

    setLoading(true);

    await axios.post(`${API}/api/v1/task/create`, form, {
      withCredentials: true,
    });

    setForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });

    await fetchTasks();
    setActiveTab("all");

    setLoading(false);
  };

  const reviewTask = async (taskId, status) => {
    await axios.patch(
      `${API}/api/v1/task/${taskId}/review`,
      { status },
      { withCredentials: true },
    );

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status } : t)),
    );
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/api/v1/task/${taskId}`, {
        withCredentials: true,
      });

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const submittedTasks = useMemo(
    () => tasks.filter((t) => t.status === "under-review"),
    [tasks],
  );

  const allTasks = useMemo(() => tasks, [tasks]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "under-review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-green-500/20 text-green-300 border-green-500/30";
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 pt-24 relative overflow-hidden flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Enterprise Task Hub
        </h1>
        <p className="text-white/60 mt-2">
          Assign, track, and manage employee tasks
        </p>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-3 mb-8 justify-center">
        {["assign", "submitted", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-black shadow-lg"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= ASSIGN ================= */}
      {activeTab === "assign" && (
        <div className="w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl max-w-3xl w-full"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-center">
              Create New Task
            </h2>

            <div className="flex flex-col gap-4">
              {/* TITLE */}
              <input
                placeholder="Task Title"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-blue-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              {/* DESCRIPTION */}
              <textarea
                placeholder="Task Description"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-blue-500 h-28"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* RESPONSIVE GRID (FIXED) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SELECT EMPLOYEE */}
                <select
                  className="w-full min-w-0 p-3 rounded-xl bg-black/40 border border-white/10 text-sm sm:text-base"
                  value={form.assignedTo}
                  onChange={(e) =>
                    setForm({ ...form, assignedTo: e.target.value })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>

                {/* DATE */}
                <input
                  type="date"
                  className="w-full min-w-0 p-3 rounded-xl bg-black/40 border border-white/10 text-sm sm:text-base"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={createTask}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
              >
                {loading ? "Creating..." : "Assign Task"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= SUBMITTED ================= */}
      {activeTab === "submitted" && (
        <div className="w-full flex flex-col items-center gap-4 max-w-4xl">
          <h2 className="text-2xl font-semibold text-center">
            Submitted Tasks
          </h2>

          {submittedTasks.length === 0 ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-black/10 border border-white/10 backdrop-blur-sm w-full">
                <div className="p-3 rounded-full bg-black/20">
                  <Inbox className="w-6 h-6 text-white/60" />
                </div>

                <h3 className="text-white/70 text-lg font-medium">
                  No tasks under review
                </h3>

                <p className="text-white/40 text-sm text-center">
                  When employees submit tasks, they will appear here for
                  approval.
                </p>
              </div>
            </div>
          ) : (
            submittedTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-5 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="text-xl font-semibold">{task.title}</h3>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Submission Note */}
                  <div>
                    <p className="font-semibold text-[15px] mb-2">
                      Submission Note
                    </p>

                    <div className="p-3 bg-black/10 backdrop-blur-sm border border-white/20 rounded-xl h-[180px] overflow-y-auto scrollable">
                      <p className="text-white/90 whitespace-pre-wrap">
                        {task.submissionNote || "No submission note provided."}
                      </p>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <p className="font-semibold text-[15px] mb-2">
                      Attachments
                    </p>

                    <div className="p-3 bg-black/10 backdrop-blur-sm border border-white/20 rounded-xl h-[180px] overflow-y-auto scrollable">
                      {task.attachments?.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {task.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-blue-300 break-all"
                            >
                              📎 {attachment}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">
                          No attachments submitted.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="mt-3" />
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 sm:gap-0">
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => reviewTask(task._id, "completed")}
                      className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => reviewTask(task._id, "rejected")}
                      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300"
                    >
                      Reject
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-white/60 text-end">
                    Submitted By:{" "}
                    <span className="text-white font-medium">
                      @{task?.assignedTo?.username || "unknown"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ================= ALL ================= */}
      {activeTab === "all" && (
        <div className="w-full flex flex-col items-center gap-4 max-w-4xl">
          <h2 className="text-2xl font-semibold text-center">All Tasks</h2>

          {allTasks.length === 0 ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-black/10 border border-white/10 backdrop-blur-sm w-full">
                <div className="p-3 rounded-full bg-black/20">
                  <Inbox className="w-6 h-6 text-white/60" />
                </div>

                <h3 className="text-white/70 text-lg font-medium">
                  No tasks to show
                </h3>

                <p className="text-white/40 text-sm text-center">
                  When a task is added, it will appear here.
                </p>
              </div>
            </div>
          ) : (
            allTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                    {/* LEFT */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold">{task.title}</h3>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full border text-xs ${getStatusColor(
                            task.status,
                          )}`}
                        >
                          {task.status}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1 ${getPriorityColor(
                            task.priority,
                          )}`}
                        >
                          <Flag size={12} />
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="bg-white/5 border-white/10"
                        onClick={() =>
                          setExpandedTask(
                            expandedTask === task._id ? null : task._id,
                          )
                        }
                      >
                        <Eye size={16} />
                        <span className="ml-2">Details</span>

                        {expandedTask === task._id ? (
                          <ChevronUp size={16} className="ml-2" />
                        ) : (
                          <ChevronDown size={16} className="ml-2" />
                        )}
                      </Button>

                      <EditTaskDialog task={task} onUpdated={fetchTasks} />

                      <Button
                        onClick={() => setTaskToDelete(task)}
                        className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* QUICK INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                    <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <User size={15} />
                        Assigned To
                      </div>

                      <p className="mt-2 font-medium">
                        {task.assignedTo?.name ||
                          task.assignedTo?.username ||
                          "Unknown"}
                      </p>
                    </div>

                    <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <UserCog size={15} />
                        Assigned By
                      </div>

                      <p className="mt-2 font-medium">
                        {task.assignedBy?.name ||
                          task.assignedBy?.username ||
                          "Unknown"}
                      </p>
                    </div>

                    <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <CalendarDays size={15} />
                        Due Date
                      </div>

                      <p className="mt-2 font-medium">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "Not Set"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DETAILS PANEL */}
                {expandedTask === task._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    className="border-t border-white/10 bg-black/10"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={16} />
                        <h4 className="font-semibold">Task Description</h4>
                      </div>

                      <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                        <p className="text-white/80 whitespace-pre-wrap">
                          {task.description || "No description provided."}
                        </p>
                      </div>

                      {task.submissionNote && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">
                            Submission Note
                          </h4>

                          <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                            {task.submissionNote}
                          </div>
                        </div>
                      )}

                      {task.attachments?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Attachments</h4>

                          <div className="flex flex-col gap-2">
                            {task.attachments.map((attachment, index) => (
                              <a
                                key={index}
                                href={attachment}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-black/20 border border-white/10 p-3 text-blue-300 hover:bg-white/5 transition"
                              >
                                📎 {attachment}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ================= DELETE CONFIRM DIALOG ================= */}
      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(open) => {
          if (!open) setTaskToDelete(null);
        }}
      >
        <AlertDialogContent className="bg-black border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                {taskToDelete?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteTask(taskToDelete._id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
