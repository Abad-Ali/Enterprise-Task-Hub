import { Task } from "../models/task.model.js";

/* ---------------- CREATE TASK ---------------- */
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    const assignedBy = req.id;

    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({
        message: "Required fields missing",
        success: false,
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy,
      priority: priority || "medium",
      dueDate,
      status: "pending",
    });

    return res.status(201).json({
      message: "Task created successfully",
      success: true,
      task,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/* ---------------- GET MY TASKS ---------------- */
export const getMyTasks = async (req, res) => {
  try {
    const userId = req.id;

    const tasks = await Task.find({
      $or: [{ assignedTo: userId }, { assignedBy: userId }],
    })
      .populate("assignedTo", "username email name")
      .populate("assignedBy", "username email name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- GET ALL TASKS ---------------- */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "username email name")
      .populate("assignedBy", "username email name")
      .populate("reviewedBy", "username email name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- UPDATE TASK ---------------- */
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- UPDATE STATUS (WORKFLOW) ---------------- */
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "in-progress",
      "under-review",
      "completed",
      "rejected",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        success: false,
      });
    }

    const updateData = { status };

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task status updated",
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- SUBMIT TASK (EMPLOYEE) ---------------- */
export const submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { submissionNote, attachments } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    task.submissionNote = submissionNote || "";
    task.attachments = attachments || [];
    task.status = "under-review";

    await task.save();

    return res.status(200).json({
      message: "Task submitted for review",
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- REVIEW TASK (MANAGER/ADMIN) ---------------- */
export const reviewTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const allowed = ["completed", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid review status",
        success: false,
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    task.status = status;
    task.reviewedBy = req.id;
    task.reviewedAt = new Date();

    if (status === "completed") {
      task.completedAt = new Date();
    }

    await task.save();

    return res.status(200).json({
      message: "Task reviewed successfully",
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- DELETE TASK ---------------- */
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const tasks = await Task.find();

    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalTasks: tasks.length,

      assignedToday: tasks.filter(
        (t) => new Date(t.createdAt) >= startOfToday
      ).length,

      completedToday: tasks.filter(
        (t) =>
          t.status === "completed" &&
          new Date(t.completedAt || t.updatedAt) >= startOfToday
      ).length,

      monthlyTasks: tasks.filter(
        (t) => new Date(t.createdAt) >= startOfMonth
      ).length,

      pending: tasks.filter((t) => t.status === "pending").length,

      overdue: tasks.filter(
        (t) =>
          t.status !== "completed" &&
          new Date(t.dueDate) < now
      ).length,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.id;

    const tasks = await Task.find({ assignedTo: userId });

    const total = tasks.length;

    const pending = tasks.filter(t => t.status === "pending").length;
    const progress = tasks.filter(t => t.status === "in-progress").length;
    const review = tasks.filter(t => t.status === "under-review").length;
    const completed = tasks.filter(t => t.status === "completed").length;

    // REAL WEEKLY GROUPING
    const weekMap = {};

    tasks.forEach((task) => {
      const date = new Date(task.createdAt);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      weekMap[day] = (weekMap[day] || 0) + 1;
    });

    const weekly = Object.keys(weekMap).map((key) => ({
      name: key,
      tasks: weekMap[key],
    }));

    return res.json({
      success: true,
      stats: {
        total,
        pending,
        progress,
        review,
        completed,
        weekly,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};