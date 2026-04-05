import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, User, ArrowRight, Zap } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (!result.error) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* --- Ambient Background Glow --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* --- Branding/Header --- */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 shadow-2xl mb-2">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            SECURE ACCESS
          </h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
            Identity Verification Required
          </p>
        </div>

        {/* --- Login Card --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold text-center uppercase tracking-widest animate-in shake duration-300">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username Field */}
            <div className="relative group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                Username / Email
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Registry ID"
                  className="w-full p-4 pl-12 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-700 focus:border-blue-500/50 outline-none transition-all font-bold"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                Access Key
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 pl-12 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-700 focus:border-blue-500/50 outline-none transition-all font-bold"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className={`group w-full p-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
            }`}
          >
            {loading ? "Authorizing..." : "Initialize Session"}
            {!loading && (
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>

          {/* Feature Badge */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber-500 fill-amber-500" />
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                Encrypted
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-green-500" />
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                Verified Hub
              </span>
            </div>
          </div>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm font-medium text-gray-600">
          Not registered in the network?{" "}
          <Link
            to="/register"
            className="text-white font-bold hover:text-blue-400 transition-colors"
          >
            Register Tenant
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
