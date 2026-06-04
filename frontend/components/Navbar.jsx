"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import {
  Home,
  LayoutDashboard,
  ClipboardList,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  const isLoggedIn = !!user;
  const isEmployee = role === "employee";
  const isAdminOrManager = role === "admin" || role === "manager";

  const handleDashboard = () => {
    if (!role) return;

    if (role === "admin" || role === "manager") {
      router.push("/admin-dashboard");
    } else {
      router.push("/employee-dashboard");
    }

    setOpen(false);
  };

  const itemClass =
    "flex items-center gap-2 text-white/80 hover:text-white transition";

  // ✅ close on scroll (mobile)
  useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  // ✅ close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // ✅ close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 w-[95vw] lg:w-[80vw] z-50"
    >
      <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-3xl p-1 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-8 h-8 rounded-md object-cover"
            />
            <span className="text-white font-bold text-xl">
              Enterprise Task Hub
            </span>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 font-semibold">

            <Link href="/" className={itemClass}>
              <Home size={18} /> Home
            </Link>

            {isLoggedIn && (
              <button onClick={handleDashboard} className={itemClass}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
            )}

            {isLoggedIn && isEmployee && (
              <>
                <Link href="/tasks" className={itemClass}>
                  <ClipboardList size={18} /> My Tasks
                </Link>
                <Link href="/profile" className={itemClass}>
                  <User size={18} /> Profile
                </Link>
              </>
            )}

            {isLoggedIn && isAdminOrManager && (
              <>
                <Link href="/manage-tasks" className={itemClass}>
                  <ClipboardList size={18} /> Manage
                </Link>
                <Link href="/profile" className={itemClass}>
                  <User size={18} /> Profile
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link href="/signin" className={itemClass}>
                  <LogIn size={18} /> Sign In
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-4 py-1 rounded-lg bg-white text-black font-medium hover:scale-105 transition"
                >
                  <UserPlus size={18} /> Sign Up
                </Link>
              </>
            )}

            <a
              href="https://github.com/Abad-Ali"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-white transition ml-2"
            >
              <img src="/github.png" alt="GitHub" className="w-6 h-6" />
              <span>Abad Ali</span>
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-white text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 pb-4 flex flex-col gap-3 text-white/80"
          >
            <Link href="/" onClick={() => setOpen(false)} className={itemClass}>
              <Home size={18} /> Home
            </Link>

            {isLoggedIn && (
              <button onClick={handleDashboard} className={itemClass}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
            )}

            {isLoggedIn && isEmployee && (
              <>
                <Link href="/tasks" onClick={() => setOpen(false)} className={itemClass}>
                  <ClipboardList size={18} /> My Tasks
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)} className={itemClass}>
                  <User size={18} /> Profile
                </Link>
              </>
            )}

            {isLoggedIn && isAdminOrManager && (
              <>
                <Link href="/manage-tasks" onClick={() => setOpen(false)} className={itemClass}>
                  <ClipboardList size={18} /> Manage
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)} className={itemClass}>
                  <User size={18} /> Profile
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link href="/signin" onClick={() => setOpen(false)} className={itemClass}>
                  <LogIn size={18} /> Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className={itemClass}>
                  <UserPlus size={18} /> Sign Up
                </Link>
              </>
            )}

            <a
              href="https://github.com/Abad-Ali"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 pt-2 border-t border-white/10"
            >
              <img src="/github.png" alt="GitHub" className="w-6 h-6" />
              Abad Ali
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}