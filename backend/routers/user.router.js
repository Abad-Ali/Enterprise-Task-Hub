import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../controllers/user.controller.js";

const router = express.Router();

// AUTH ROUTES 
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// USER CRUD ROUTES 
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// STATUS UPDATE 
router.patch("/:id/status", updateUserStatus);

export default router;