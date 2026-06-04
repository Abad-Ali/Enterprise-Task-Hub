import express from "express";
import {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  updateTaskStatus,
  submitTask,
  reviewTask,
  deleteTask,
  getDashboardStats,
  getEmployeeDashboard,
} from "../controllers/task.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// CREATE TASK 
router.post("/create",isAuthenticated , createTask);

// GET TASKS
router.get("/my",isAuthenticated, getMyTasks);
router.get("/all", getAllTasks);

// UPDATE TASK 
router.put("/:taskId", updateTask);

// STATUS UPDATE 
router.patch("/:taskId/status", updateTaskStatus);

// SUBMIT TASK 
router.patch("/:taskId/submit", submitTask);

// REVIEW TASK 
router.patch("/:taskId/review", reviewTask);

// DELETE TASK
router.delete("/:taskId", deleteTask);

//Dashboard 
router.get("/dashboard", isAuthenticated, getDashboardStats);
router.get("/employee-dashboard", isAuthenticated, getEmployeeDashboard);

export default router;