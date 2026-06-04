"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);

  const handleOpen = (value) => {
    setType(value);
    setOpen(true);
  };

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-full mt-16"
      >
        <div className="backdrop-blur-md bg-black/20 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6 py-10">

            {/* TOP SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-white">

              <div>
                <h2 className="text-2xl font-bold">Enterprise Task Hub</h2>

                <p className="text-white/60 mt-2 text-sm leading-relaxed">
                  Manage tasks, assign work, and track progress efficiently.
                  Built with Next.js for modern enterprise workflows.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">

                  <a href="https://github.com/Abad-Ali" target="_blank"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                    <img src="/github.png" className="w-5 h-5" />
                  </a>

                  <a href="https://linkedin.com/in/abadali-dev" target="_blank"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M19 3A2 2 0 0121 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-11 7H6v9h2v-9zm-1-1.5a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM20 19v-5.5c0-2.5-1.5-3.5-3-3.5-1.2 0-2 .6-2.3 1.1V10H13v9h2v-5c0-1.2.7-2 1.7-2s1.3.7 1.3 2V19h2z"/>
                    </svg>
                  </a>

                  <a href="https://www.instagram.com/abadali_17/" target="_blank"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 4a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/>
                    </svg>
                  </a>

                  <a href="https://abadali.vercel.app"
                    target="_blank"
                    className="px-3 py-2 text-xs rounded-full bg-white/5 hover:bg-white/10 transition text-white/80 hover:text-white">
                    <div className="flex gap-1 items-center justify-center">
                      <Globe className="w-5 h-5" /> Portfolio
                    </div>
                  </a>

                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <div className="flex flex-col gap-2 text-white/70 text-sm">
                  <Link href="/">Home</Link>
                  <Link href="/signin">Sign In</Link>
                  <Link href="/signup">Sign Up</Link>
                  <Link href="/profile">Profile</Link>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">About</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  A smart task management system built using Next.js, Node.js,
                  and MongoDB for enterprise-level workflow management.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10" />

            <div className="pt-6 flex flex-col md:flex-row justify-between text-white/60 text-sm">
              <p>© {new Date().getFullYear()} Enterprise Task Hub. All rights reserved.</p>

              <div className="flex gap-5 mt-3 md:mt-0">
                <span onClick={() => handleOpen("privacy")} className="cursor-pointer hover:text-white">Privacy</span>
                <span onClick={() => handleOpen("terms")} className="cursor-pointer hover:text-white">Terms</span>
                <span onClick={() => handleOpen("support")} className="cursor-pointer hover:text-white">Support</span>
              </div>
            </div>

          </div>
        </div>
      </motion.footer>

      {/* ✅ DIALOG CONTENT (REAL PROJECT CONTENT) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/10 backdrop-blur-sm border border-white/20 text-white max-w-2xl">

          <DialogHeader>
            <DialogTitle className="capitalize text-lg">
              {type}
            </DialogTitle>
          </DialogHeader>

          {/* PRIVACY POLICY */}
          {type === "privacy" && (
            <div className="text-sm text-white/70 space-y-3">
              <p>
                We respect your privacy. Enterprise Task Hub collects only essential
                data required for authentication, task management, and system improvement.
              </p>
              <p>
                Your personal information such as email and profile data is securely stored
                in our database and is never shared with third parties.
              </p>
              <p>
                We use secure authentication mechanisms and encryption to protect user data.
                You have full control over your account and data deletion requests.
              </p>
            </div>
          )}

          {/* TERMS */}
          {type === "terms" && (
            <div className="text-sm text-white/70 space-y-3">
              <p>
                By using Enterprise Task Hub, you agree to use the platform only for
                lawful purposes related to task and workflow management.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and all activities under your account.
              </p>
              <p>
                We reserve the right to update features, modify services, or suspend accounts
                in case of misuse or violation of policies.
              </p>
            </div>
          )}

          {/* SUPPORT */}
          {type === "support" && (
            <div className="text-sm text-white/70 space-y-3">
              <p>
                Need help? Our support team is available to assist you with any technical
                or account-related issues.
              </p>
              <p>
                📧 Email: support@enterprisetaskhub.com
              </p>
              <p>
                ⏱ Response Time: 24–48 hours
              </p>
              <p>
                You can also raise issues via GitHub or contact your system administrator.
              </p>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}