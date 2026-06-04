"use client";

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/app/(main)/redux/authSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const API = process.env.NEXT_PUBLIC_API_URI;

export default function SettingsDialog({ user }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState({
    logout: false,
    delete: false,
  });

//   LOGOUT 
  const logout = async () => {
    setLoading((p) => ({ ...p, logout: true }));

    try {
      await axios.post(
        `${API}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );

      dispatch(setAuthUser(null));
      window.location.href = "/signin";
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((p) => ({ ...p, logout: false }));
    }
  };

//   DELETE ACCOUNT 
  const deleteAccount = async () => {
    if (!user?._id) return;

    setLoading((p) => ({ ...p, delete: true }));

    try {
      await axios.delete(
        `${API}/api/v1/user/${user._id}`,
        { withCredentials: true }
      );

      dispatch(setAuthUser(null));
      window.location.href = "/signin";
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((p) => ({ ...p, delete: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-white/10 hover:bg-white/20">
          Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="
        bg-zinc-950 
        border border-zinc-800 
        text-white 
        w-[95vw] sm:max-w-xl 
        max-h-[90vh] 
        overflow-y-auto
        rounded-xl
      ">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Account Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="security" className="mt-4">
          <TabsList className="
            grid grid-cols-3 
            bg-white/5 
            rounded-lg 
            overflow-hidden
          ">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="danger" className="text-red-400">
              Danger
            </TabsTrigger>
          </TabsList>

          {/* ---------------- PREFERENCES ---------------- */}
          <TabsContent value="preferences" className="mt-5">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white/60">
              Preferences coming soon...
            </div>
          </TabsContent>

          {/* ---------------- DANGER ---------------- */}
          <TabsContent value="danger" className="mt-5 space-y-4">

            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10">
              <p className="text-red-300 font-semibold">
                Danger Zone
              </p>
              <p className="text-xs text-red-200/70 mt-1">
                These actions are permanent.
              </p>
            </div>

            {/* LOGOUT */}
            <Button
              onClick={logout}
              disabled={loading.logout}
              className="w-full bg-white/10 hover:bg-white/20"
            >
              {loading.logout ? "Logging out..." : "Logout"}
            </Button>

            {/* DELETE WITH CONFIRM DIALOG */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={loading.delete}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete your account?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-white/60">
                    This action cannot be undone. Your account and all data
                    will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 hover:bg-white/20">
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={deleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading.delete ? "Deleting..." : "Yes, delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}