import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Building2, UserCircle } from "lucide-react";
import API from "../api/axios";

const Register = () => {
  const [searchParams] = useSearchParams();
  const invitedOrgId = searchParams.get("orgId");
  const invitedEmail = searchParams.get("email");

  // If orgId exists in URL, default to 'Joining' mode
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

  // Update form if URL params change
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
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setLocalError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            {isJoining ? <Building2 size={32} /> : <UserCircle size={32} />}
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-gray-800 tracking-tight">
          {isJoining ? "Join Your Team" : "Create Global Tenant"}
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          {isJoining
            ? "Complete your profile to join the organization."
            : "Start your own multi-tenant video workspace."}
        </p>

        {/* Invite Notification */}
        {invitedOrgId && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold">
            <CheckCircle size={16} />
            You've been invited! Organization ID is pre-filled.
          </div>
        )}

        {/* Toggle Switch - Hidden if user is invited via link */}
        {!invitedOrgId && (
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${!isJoining ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => {
                setIsJoining(false);
                setFormData({ ...formData, organizationId: "", role: "admin" });
              }}
            >
              New Org
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${isJoining ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => {
                setIsJoining(true);
                setFormData({
                  ...formData,
                  organizationName: "",
                  role: "viewer",
                });
              }}
            >
              Join Existing
            </button>
          </div>
        )}

        {localError && (
          <p className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
            {localError}
          </p>
        )}

        {/* --- Step 1: Organization Context --- */}
        {!isJoining ? (
          <div className="mb-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
              Organization Name
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Organization ID
              </label>
              <input
                type="text"
                value={formData.organizationId}
                readOnly={!!invitedOrgId}
                placeholder="Paste ID from Admin"
                className={`w-full p-3 rounded-xl border outline-none transition ${
                  invitedOrgId
                    ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                    : "bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-400"
                }`}
                required
                onChange={(e) =>
                  setFormData({ ...formData, organizationId: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Select Your Role
              </label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="viewer">Viewer (View Only)</option>
                <option value="editor">Editor (Upload & Edit)</option>
              </select>
            </div>
          </div>
        )}

        <div className="my-6 border-t border-gray-100"></div>

        {/* --- Step 2: Credentials --- */}
        <div className="mb-4">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
            Email / Username
          </label>
          <input
            type="text"
            value={formData.username}
            readOnly={!!invitedEmail}
            className={`w-full p-3 rounded-xl border outline-none transition ${
              invitedEmail
                ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                : "bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-400"
            }`}
            required
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
            Create Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          disabled={loading}
          className={`w-full p-4 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200"
          }`}
        >
          {loading
            ? "Creating Account..."
            : isJoining
              ? "Join Team"
              : "Launch Organization"}
        </button>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
