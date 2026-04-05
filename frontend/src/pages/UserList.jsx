import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Trash2,
  Copy,
  Check,
  Shield,
  Mail,
  Users,
  UserMinus,
} from "lucide-react";
import { useSelector } from "react-redux";
import API from "../api/axios";

const UserList = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const inviteLink = `${window.location.origin}/register?orgId=${user?.organizationId}&email=${inviteEmail}`;

  const copyToClipboard = () => {
    if (!inviteEmail) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently remove this user from the workspace?")) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Operation failed");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-10 animate-in fade-in duration-700">
      {/* --- Header Section --- */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Team Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Control access and invite collaborators to{" "}
            <span className="text-slate-900 font-bold">
              {user?.organizationName}
            </span>
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Total Members: {users.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- Left Column: Invitation Panel --- */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/20 text-white sticky top-28">
            <div className="bg-blue-600/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
              <UserPlus className="text-blue-400" size={24} />
            </div>
            <h2 className="text-xl font-black tracking-tight mb-2 text-white">
              Generate Invite
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-8 font-medium">
              Enter an email to generate a secure magic link. New users will be
              automatically assigned to your tenant.
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-white transition-all"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <button
                onClick={copyToClipboard}
                disabled={!inviteEmail}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  copied
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Link Copied" : "Copy Magic Link"}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Shield size={14} className="text-blue-500" />
                Tenant-Isolated Link
              </div>
            </div>
          </div>
        </div>

        {/* --- Right Column: User Table --- */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Identity
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Privilege
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 border border-slate-200">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">
                            {u.username}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {u.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          u.role === "admin"
                            ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                            : "bg-slate-50 border-slate-100 text-slate-500"
                        }`}
                      >
                        <Shield size={10} />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {u._id !== user.id ? (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-3 bg-white text-slate-400 hover:text-red-600 border border-slate-100 rounded-xl hover:shadow-lg hover:shadow-red-50 transition-all active:scale-90"
                        >
                          <UserMinus size={18} />
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-2 italic">
                          Me
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="p-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
