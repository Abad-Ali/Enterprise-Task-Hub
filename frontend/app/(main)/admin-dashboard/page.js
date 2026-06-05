"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";

const API = process.env.NEXT_PUBLIC_API_URI;

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const role = "manager";

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/task/dashboard`, {
        withCredentials: true,
      });

      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  if (role !== "manager") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Access Denied
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  /* derived chart data */
  const chartData = [
    { name: "Today", tasks: stats.assignedToday },
    { name: "Month", tasks: stats.monthlyTasks },
    { name: "Completed", tasks: stats.completedToday },
    { name: "Pending", tasks: stats.pending },
    { name: "Overdue", tasks: stats.overdue },
  ];

  const statusData = [
    { name: "Completed", value: stats.completedToday },
    { name: "Pending", value: stats.pending },
    { name: "Overdue", value: stats.overdue },
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-white px-6 py-10 pt-25">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-semibold">{user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">
          Live overview of task activity
        </p>
      </motion.div>

      {/* KPI GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">

        <Kpi title="Total Tasks" value={stats.totalTasks} />
        <Kpi title="Assigned Today" value={stats.assignedToday} />
        <Kpi title="Completed Today" value={stats.completedToday} />
        <Kpi title="This Month" value={stats.monthlyTasks} />
        <Kpi title="Pending" value={stats.pending} />
        <Kpi title="Overdue" value={stats.overdue} />

      </div>

      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">

        {/* BAR */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg mb-4">Task Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg mb-4">Task Status Distribution</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SUMMARY SECTION */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

        <SummaryCard
          title="Today's Activity"
          items={[
            `Assigned: ${stats.assignedToday}`,
            `Completed: ${stats.completedToday}`,
          ]}
        />

        <SummaryCard
          title="Monthly Overview"
          items={[
            `Total Tasks: ${stats.monthlyTasks}`,
            `Pending: ${stats.pending}`,
          ]}
        />

        <SummaryCard
          title="Risk & Alerts"
          items={[
            `Overdue Tasks: ${stats.overdue}`,
            "Performance: Stable",
          ]}
        />
      </div>
    </div>
  );
}

/* KPI CARD */
function Kpi({ title, value }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="p-4 rounded-xl border border-white/10 bg-white/5"
    >
      <p className="text-white/40 text-xs">{title}</p>
      <h3 className="text-xl font-semibold mt-2">{value}</h3>
    </motion.div>
  );
}

/* SUMMARY CARD */
function SummaryCard({ title, items }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl border border-white/10 bg-white/5"
    >
      <h3 className="text-sm text-white/60 mb-3">{title}</h3>

      <ul className="space-y-2 text-sm text-white/80">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </motion.div>
  );
}