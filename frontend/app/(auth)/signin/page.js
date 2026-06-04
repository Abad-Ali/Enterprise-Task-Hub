"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/app/(main)/redux/authSlice";

export default function SigninPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signinHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/v1/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Login successful");
        
        dispatch(setAuthUser(res.data.user));

        setInput({
          email: "",
          password: "",
        });

        router.push("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center text-white px-4 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md sm:max-w-lg border border-white/10 bg-black/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
      >

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-8"
        >
          <Image
            src="/logo.jpg"
            alt="Logo"
            priority
            width={100}
            height={100}
            className="rounded-2xl"
          />

          <h1 className="text-2xl font-bold mt-4 tracking-tight">
            Enterprise Task Hub
          </h1>

          <p className="text-sm text-white/60 text-center mt-1">
            Welcome back. Sign in to continue.
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={signinHandler}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>
            <Label className="text-white">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 bg-black/30 border-white/10 focus:border-white/30"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label className="text-white">Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 bg-black/30 border-white/10 focus:border-white/30"
              required
            />
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </motion.form>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-white/60 mt-6"
        >
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-white font-medium hover:underline"
          >
            Sign Up
          </Link>
        </motion.p>

      </motion.div>
    </div>
  );
}