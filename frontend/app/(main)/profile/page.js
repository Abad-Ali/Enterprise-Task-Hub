"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { setAuthUser } from "../redux/authSlice";
import EditProfileDialog from "@/components/EditProfileDialog";
import SettingsDialog from "@/components/SettingsDialog";

const API = process.env.NEXT_PUBLIC_API_URI;

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const logout = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${API}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );

      dispatch(setAuthUser(null));

      window.location.href = "/signin";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl sm:grid grid-cols-12 gap-6"
      >
        {/* Mobile Header */}
        <div className="py-4 pt-12 text-center sm:hidden">
          <motion.h2 variants={item} className="text-4xl font-semibold">
            Profile Overview
          </motion.h2>

          <motion.p
            variants={item}
            className="text-white/50 text-sm text-center"
          >
            Manage your personal information and account settings
          </motion.p>
        </div>

        {/* LEFT PANEL */}
        <div className="col-span-4 top-10 h-fit pb-2 sm:pb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/10 bg-black/10 p-6 hover:scale-105 duration-300"
          >
            {/* AVATAR */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                {/* Rotating Border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[-6px] rounded-full border-[3px] border-e-blue-700 border-l-blue-700 border-b-[#0f172b] border-t-[#0f172b]"
                />

                <Avatar className="w-24 h-24 border-2 border-blue-700">
                  <AvatarImage
                    src={user?.profilePicture || "/default_pic.jpg"}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-white/10 text-xl">
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* <label className="absolute bottom-0 right-0 text-[10px] px-2 py-1 rounded-full bg-black/10 cursor-pointer hover:bg-black/20">
                  edit
                  <input type="file" hidden onChange={handleImageChange} />
                </label> */}
              </div>

              <div>
                <h1 className="text-xl font-semibold">{user?.name}</h1>
                <p className="text-white/50 text-sm">
                  @{user?.username}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300">
                {user?.role?.toUpperCase()}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-2">
              <EditProfileDialog user={user} />

              <SettingsDialog  user={user}/>

              {/* LOGOUT CONFIRMATION */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer">
                    Logout
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirm Logout
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-zinc-400">
                      Are you sure you want to logout from your account?
                      You will need to login again to access your dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={logout}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      {loading ? "Logging out..." : "Logout"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-4"
          >
            <motion.h2
              variants={item}
              className="text-4xl font-semibold hidden sm:block"
            >
              Profile Overview
            </motion.h2>

            <motion.p
              variants={item}
              className="text-white/50 text-sm text-center sm:text-start hidden sm:block"
            >
              Manage your personal information and account settings
            </motion.p>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Info label="Email" value={user?.email} />
              <Info label="Employee ID" value={user?.employeeId} />
              <Info label="Department" value={user?.department || "-"} />
              <Info label="Designation" value={user?.designation || "-"} />
            </div>

            {/* ACCOUNT STATUS */}
            <motion.div
              variants={item}
              whileHover={{ scale: 1.001 }}
              className="mt-6 p-5 rounded-xl border border-white/10 bg-black/10 hover:bg-white/10"
            >
              <p className="text-sm text-white/50">
                Account Status
              </p>

              <p className="text-green-400 mt-1">
                Active & Verified
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* INFO CARD */
function Info({ label, value }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl border border-white/10 bg-black/10 hover:bg-white/[0.07] transition"
    >
      <p className="text-white/40 text-xs">{label}</p>

      <p className="text-[10px] sm:text-sm mt-1">
        {value}
      </p>
    </motion.div>
  );
}