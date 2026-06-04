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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/v1/user/register`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully");

        setInput({
          name: "", 
          username: "",
          email: "",
          password: "",
        });

        router.push('/signin');
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center text-white px-4 relative overflow-hidden">

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md sm:max-w-lg border border-white/10 bg-black/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
      >

        {/* LOGO SECTION */}
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
            Create your account and start managing tasks smarter
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={signupHandler}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >

          {/* NAME (NEW FIELD ADDED - UI UNCHANGED STYLE) */}
          <div>
            <Label className="text-white">Name</Label>
            <Input
              name="name"
              value={input.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="mt-1 bg-black/30 border-white/10 focus:border-white/30 focus:ring-0"
              required
            />
          </div>

          {/* USERNAME */}
          <div>
            <Label className="text-white">Username</Label>
            <Input
              name="username"
              value={input.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="mt-1 bg-black/30 border-white/10 focus:border-white/30 focus:ring-0"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label className="text-white">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="mt-1 bg-black/30 border-white/10 focus:border-white/30 focus:ring-0"
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
              placeholder="Enter password"
              className="mt-1 bg-black/30 border-white/10 focus:border-white/30 focus:ring-0"
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
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </motion.form>

        {/* FOOTER LINK */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-white/60 mt-6"
        >
          Already have an account?{" "}
          <Link href="/signin" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}