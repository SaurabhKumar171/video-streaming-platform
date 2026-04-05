import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Building2,
  UserCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import API from "../api/axios";

const Register = () => {
  const [searchParams] = useSearchParams();
  const invitedOrgId = searchParams.get("orgId");
  const invitedEmail = searchParams.get("email");

  const [isJoining, setIsJoining] = useState(!!invitedOrgId);
  const [formData, setFormData] = useState({
    username: invitedEmail || "",
    password: "",
    role: "viewer",
    organizationName: "",
    organizationId: invitedOrgId || "",
  });

  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (invitedOrgId) {
      setIsJoining(true);
      setFormData((prev) => ({
        ...prev,
        organizationId: invitedOrgId,
        username: invitedEmail || prev.username,
      }));
    }
  }, [invitedOrgId, invitedEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    try {
      const payload = {
        ...formData,
        role: isJoining ? formData.role : "admin",
      };
      await API.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setLocalError(
        err.response?.data?.message || "Registry synchronization failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-6 shadow-2xl">
            {isJoining ? <Building2 size={32} /> : <Shield size={32} />}
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
            {isJoining ? "Member Registry" : "Initialize Tenant"}
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">
            {isJoining
              ? "Complete synchronization with your organization."
              : "Deploy a new isolated video workspace."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6"
        >
          {/* Invited Banner */}
          {invitedOrgId && (
            <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <CheckCircle size={18} className="text-blue-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
                Invite Link Verified
              </span>
            </div>
          )}

          {/* Toggle Switch */}
          {!invitedOrgId && (
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
              <button
                type="button"
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isJoining ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white"}`}
                onClick={() => setIsJoining(false)}
              >
                New Workspace
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isJoining ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-white"}`}
                onClick={() => setIsJoining(true)}
              >
                Join Existing
              </button>
            </div>
          )}

          {localError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold text-center uppercase tracking-widest">
              {localError}
            </div>
          )}

          {/* Dynamic Fields */}
          <div className="space-y-5">
            {!isJoining ? (
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                  Org Identity
                </label>
                <input
                  type="text"
                  placeholder="ACME GLOBAL SYSTEMS"
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-700 focus:border-blue-500/50 outline-none transition-all font-bold"
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationName: e.target.value,
                    })
                  }
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                    Tenant ID
                  </label>
                  <input
                    type="text"
                    value={formData.organizationId}
                    readOnly={!!invitedOrgId}
                    className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white outline-none font-mono text-xs tracking-widest disabled:opacity-50"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                    Assigned Role
                  </label>
                  <select
                    className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all font-bold appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="viewer" className="bg-[#121214]">
                      Viewer (Read-Only)
                    </option>
                    <option value="editor" className="bg-[#121214]">
                      Editor (Manager)
                    </option>
                  </select>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-white/5 space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                  Registry Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  readOnly={!!invitedEmail}
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-700 outline-none transition-all font-bold"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                  Encryption Secret
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all font-bold"
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
            className={`group w-full p-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${loading ? "opacity-50 cursor-not-allowed" : "shadow-[0_10px_30px_rgba(37,99,235,0.3)]"}`}
          >
            {loading
              ? "Initializing..."
              : isJoining
                ? "Confirm Join"
                : "Launch Workspace"}
            {!loading && (
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-gray-600">
          Already part of the network?{" "}
          <Link
            to="/login"
            className="text-white font-bold hover:text-blue-400 transition-colors"
          >
            Authorize Access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
