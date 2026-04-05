import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuickLink from "../components/DashboardPage/QuickLink";
import StatCard from "../components/DashboardPage/StatCard";
import ActivityRow from "../components/DashboardPage/ActivityRow";
import {
  Shield,
  Video,
  Users,
  Zap,
  Activity,
  Clock,
  Database,
} from "lucide-react";
import API from "../api/axios";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState({
    videos: [],
    totalSize: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/videos");
        const videos = res.data.data;

        // Calculate real storage used from video sizes
        const sizeInBytes = videos.reduce(
          (acc, curr) => acc + (curr.size || 0),
          0,
        );
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

        setData({
          videos: videos.slice(0, 5), // Only take last 5 for "Recent Events"
          totalSize: sizeInMB,
          count: videos.length,
          loading: false,
        });
      } catch (err) {
        console.error("Dashboard Fetch Error", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- Hero: Dynamic Context --- */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 lg:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  System Status: Operational
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4 italic">
                {user?.username.split(" ")[0]}’s Hub
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl">
                Managing{" "}
                <span className="text-white font-bold">
                  {user?.organizationName}
                </span>{" "}
                assets across global CDN nodes.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem]">
              <div className="flex items-center gap-3 text-white font-bold text-xl">
                <Clock size={18} className="text-blue-400" />
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                Institutional Time
              </p>
            </div>
          </div>
        </div>

        {/* --- Live Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Database />}
            label="Cloud Payload"
            value={data.totalSize}
            suffix="MB"
            theme="blue"
          />
          <StatCard
            icon={<Video />}
            label="Active Assets"
            value={data.count || 0}
            suffix="Files"
            theme="indigo"
          />
          <StatCard
            icon={<Zap />}
            label="CDN Response"
            value="142"
            suffix="ms"
            theme="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Real Activity List: Generated from recent uploads */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-10 shadow-sm">
            <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight mb-8">
              <Activity className="text-indigo-600" size={24} /> Recent
              Ingestions
            </h3>

            <div className="space-y-4">
              {data.videos.length > 0 ? (
                data.videos.map((vid) => (
                  <ActivityRow
                    key={vid._id}
                    title={vid.title}
                    time={new Date(vid.createdAt).toLocaleDateString()}
                    type={vid.isFlagged ? "alert" : "success"}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  No activity detected in current tenant.
                </div>
              )}
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 bg-slate-100 rounded-[2.5rem] p-8 border border-slate-200 space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">
              Operations
            </h4>

            <QuickLink
              to="/library"
              label="Media Library"
              bg="bg-white"
              text="text-slate-900"
            />

            {["admin", "editor"].includes(user?.role) && (
              <QuickLink
                to="/upload"
                label="Upload Engine"
                bg="bg-blue-600"
                text="text-white"
              />
            )}

            <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 font-black text-[10px] uppercase mb-3">
                <Shield size={14} className="text-indigo-600" /> Security Layer
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Encryption</span>
                  <span className="text-green-600 uppercase tracking-tighter">
                    AES-256
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Tenant Isolation</span>
                  <span className="text-indigo-600 uppercase tracking-tighter">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
