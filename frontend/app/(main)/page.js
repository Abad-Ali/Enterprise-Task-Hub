"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Typewriter from "typewriter-effect";

export default function Home() {
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  const handleExplore = () => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (user.role === "admin" || user.role === "manager") {
      router.push("/admin-dashboard");
      return;
    }

    if (user.role === "employee") {
      router.push("/employee-dashboard");
      return;
    }

    router.push("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-6 pt-25 sm:pt-10 lg:pt-0">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold leading-tight text-center md:text-start"
          >
            Enterprise Task Hub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-white/70 text-lg text-center md:text-start"
          >
            Assign, track, and deliver work efficiently across your team. A
            modern enterprise task management system built for productivity.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-start"
          >
            {/*  WELCOME MESSAGE (ONLY WHEN LOGGED IN) */}
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full font-bold text-white text-lg ml-3 sm:ml-0 flex items-baseline gap-2 leading-tight"
              >
                <span>Welcome back,</span>
                <span className="font-bold capitalize text-[25px]">
                  <Typewriter
                    options={{
                      strings: [user?.name || ""],
                      autoStart: true,
                      loop: true,
                      pauseFor: 700,
                      cursor: "/",
                      wrapperClassName:
                        "bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold capitalize text-[25px]",
                    }}
                  />
                </span>
              </motion.div>
            )}

            {/* MAIN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium group"
            >
              <div className="flex justify-center items-center gap-2">
                {isLoggedIn ? "Go to Dashboard" : "Explore Dashboard"}{" "}
                <ArrowRight className="group-hover:ml-1.5 duration-300" />
              </div>
            </motion.button>

            {/* ONLY SHOW WHEN NOT LOGGED IN */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/signin"
                  className="px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>

          {/* FEATURES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-white/60 text-sm space-y-2"
          >
            <p>✔ Role-based task assignment</p>
            <p>✔ Real-time status tracking</p>
            <p>✔ Manager & employee workflow</p>
          </motion.div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center"
        >
          <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative"
          >
            <Image
              src="/hero.svg"
              alt="Dashboard Preview"
              width={500}
              height={500}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
