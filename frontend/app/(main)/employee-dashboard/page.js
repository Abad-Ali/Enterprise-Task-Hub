"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URI;

const COLORS = ["#3b82f6", "#22c55e", "#facc15", "#ef4444"];

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/task/employee-dashboard`, {
        withCredentials: true,
      });

      setData(res.data?.stats || {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Center text="Loading dashboard..." />;
  if (!data) return <Center text="No dashboard data found" />;

  const pieData = [
    { name: "Pending", value: data.pending || 0 },
    { name: "In Progress", value: data.progress || 0 },
    { name: "Under Review", value: data.review || 0 },
    { name: "Completed", value: data.completed || 0 },
  ];

  const weeklyData =
    Array.isArray(data.weekly) && data.weekly.length > 0
      ? data.weekly
      : [{ name: "No Data", tasks: 0 }];

  const productivity =
    data.total > 0
      ? Math.round((data.completed / data.total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 relative overflow-hidden pt-25">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-blue-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-500/10 blur-[140px] rounded-full" />

      {/* HEADER */}
      <motion.div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold">My Dashboard</h1>
        <p className="text-white/50 text-sm">
          Performance overview & productivity tracking
        </p>
      </motion.div>

      {/* KPI */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">

        <Kpi label="Total" value={data.total || 0} />
        <Kpi label="Pending" value={data.pending || 0} />
        <Kpi label="Progress" value={data.progress || 0} />
        <Kpi label="Review" value={data.review || 0} />
        <Kpi label="Completed" value={data.completed || 0} />

      </div>

      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mt-8">

        {/* PIE */}
        <Card title="Task Status">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* BAR */}
        <Card title="Weekly Activity">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* BOTTOM INSIGHTS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 mt-8">

        {/* PRODUCTIVITY RING */}
        <motion.div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-sm text-white/60 mb-3">Productivity Score</h2>

          <div className="flex items-center justify-center h-[120px]">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400">
                {productivity}%
              </p>
              <p className="text-white/50 text-sm">Completion Rate</p>
            </div>
          </div>
        </motion.div>

        {/* INSIGHT 1 */}
        <Insight
          title="Performance Insight"
          text={
            productivity > 70
              ? "Excellent work 🚀 Keep it up!"
              : "You can improve consistency 📈"
          }
        />

        {/* INSIGHT 2 */}
        <Insight
          title="Workload Status"
          text={
            data.pending > data.completed
              ? "High pending workload ⚠️"
              : "Balanced workload 👍"
          }
        />
      </div>
    </div>
  );
}

/* KPI */
function Kpi({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-white/40 text-xs">{label}</p>
      <h3 className="text-xl font-semibold mt-1">{value}</h3>
    </div>
  );
}

/* CARD WRAPPER */
function Card({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h2 className="text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}

/* INSIGHT CARD */
function Insight({ title, text }) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="text-sm text-white/60 mb-2">{title}</h3>
      <p className="text-white/80">{text}</p>
    </div>
  );
}

/* CENTER */
function Center({ text }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      {text}
    </div>
  );
}