import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  HardDrive,
  FileVideo,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock,
} from "lucide-react";
import API from "../api/axios";

const WatchVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [quality, setQuality] = useState("original");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // Senior Tip: Fetch the specific video directly if your API supports it
        const res = await API.get(`/videos`);
        const current = res.data.data.find((v) => v._id === id);
        if (current) setVideo(current);
      } catch (err) {
        console.error("Critical Stream Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  /** * SENIOR LOGIC: Direct Cloudinary Streaming
   * We no longer hit the backend /stream route.
   */
  const getStreamUrl = () => {
    if (!video) return "";

    // Check if we have pre-generated transformed URLs in the 'streams' object
    if (quality !== "original" && video.streams?.[quality]) {
      return video.streams[quality];
    }

    // Fallback to the main Cloudinary URL
    return video.videoUrl;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
            Establishing CDN Link
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e2e8f0] font-sans selection:bg-red-600 selection:text-white">
      {/* --- Navigation --- */}
      <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/20 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition-all active:scale-90 group"
        >
          <ChevronLeft
            size={32}
            className="text-gray-400 group-hover:text-white"
            strokeWidth={2}
          />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            CDN Edge Active
          </span>
        </div>
      </nav>

      {/* --- Netflix-Style Cinematic Player --- */}
      <section className="w-full h-[55vh] lg:h-[75vh] bg-black relative flex items-center justify-center overflow-hidden shadow-2xl">
        <video
          key={`${id}-${quality}`} // Forcing re-render on quality change
          src={getStreamUrl()}
          controls
          autoPlay
          className="w-full h-full object-contain"
          // Cloudinary requires crossOrigin for some features
          crossOrigin="anonymous"
        />

        {video?.status === "processing" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center">
            <Activity className="animate-spin text-red-600 mb-3" size={40} />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
              AI Policy Audit in Progress
            </p>
          </div>
        )}
      </section>

      {/* --- Metadata Hub --- */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-green-500">
                <Zap size={16} className="fill-green-500" />
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} />
                <span className="text-sm font-bold">
                  {new Date(video?.createdAt).getFullYear()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded border border-gray-700 text-[10px] font-black text-gray-400 uppercase">
                  4K UHD
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  {video?.category}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {video?.title}
              </h1>
              <p className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-4xl font-medium border-l-2 border-gray-800 pl-6">
                {video?.description ||
                  "Institutional classification summary pending for this digital asset."}
              </p>
            </div>
          </div>

          {/* SIDEBAR: Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">
                Playback Engine
              </h3>
              <div className="bg-[#121214] p-1 rounded-2xl border border-white/5 shadow-inner flex gap-1">
                {["original", "720p", "480p"].map((q) => (
                  <button
                    key={q}
                    disabled={q !== "original" && !video?.streams?.[q]}
                    onClick={() => setQuality(q)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                      quality === q
                        ? "bg-white text-black shadow-xl"
                        : "text-gray-500 hover:text-white disabled:opacity-10"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Safety Component */}
            <div
              className={`p-6 rounded-[2rem] border transition-all duration-500 ${
                video?.isFlagged
                  ? "bg-red-950/20 border-red-500/30"
                  : "bg-[#121214] border-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`p-3 rounded-2xl ${video?.isFlagged ? "bg-red-500/20" : "bg-green-500/10"}`}
                >
                  {video?.isFlagged ? (
                    <AlertTriangle className="text-red-500" />
                  ) : (
                    <ShieldCheck className="text-green-500" />
                  )}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black tracking-tighter block leading-none">
                    {video?.sensitivityScore}%
                  </span>
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    Safety Score
                  </span>
                </div>
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-[0.2em] ${video?.isFlagged ? "text-red-500" : "text-green-500"}`}
              >
                {video?.isFlagged ? "Policy Violation" : "Clearance Verified"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TechDetail
                icon={<HardDrive size={14} />}
                label="Payload"
                value={`${(video?.size / (1024 * 1024)).toFixed(2)} MB`}
              />
              <TechDetail
                icon={<FileVideo size={14} />}
                label="Codec"
                value={video?.mimetype?.split("/")[1].toUpperCase()}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TechDetail = ({ icon, label, value }) => (
  <div className="bg-[#121214] p-5 rounded-[1.5rem] border border-white/5 space-y-3 group hover:border-white/10 transition-colors">
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-sm font-black text-gray-200 block">{value}</span>
  </div>
);

export default WatchVideo;
