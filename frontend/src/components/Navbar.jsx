import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import {
  LogOut,
  Video,
  Users,
  Upload,
  LayoutDashboard,
  Library,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import API from "../api/axios";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const getLinkStyle = (path) => {
    const active = location.pathname === path;
    return `relative flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-xl group ${
      active
        ? "text-blue-400 bg-white/10 shadow-lg ring-1 ring-white/10"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;
  };

  const navLinks = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: <LayoutDashboard size={15} />,
    },
    { to: "/library", label: "Library", icon: <Library size={15} /> },
    ...(["admin", "editor"].includes(user?.role)
      ? [{ to: "/upload", label: "Upload", icon: <Upload size={15} /> }]
      : []),
    ...(user?.role === "admin"
      ? [{ to: "/users", label: "Teams", icon: <Users size={15} /> }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-100 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* --- Left: Branding --- */}
          <div className="flex items-center gap-10">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 active:scale-95 transition-transform group"
            >
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
                <Video size={20} className="fill-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-white tracking-tighter">
                  V-STREAM
                </span>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1">
                  Portal
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={getLinkStyle(link.to)}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* --- Right: Identity --- */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Workspace Label - Dark Glass Style */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
              <ShieldCheck size={14} className="text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                  Tenant
                </span>
                <span className="text-[10px] font-black text-slate-200 truncate max-w-[120px]">
                  {user?.organizationName || "Root Workspace"}
                </span>
              </div>
            </div>

            {/* User Profile Info */}
            <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-black text-white leading-none">
                  {user?.username.split(" ")[0]}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen border-t border-white/5 bg-slate-900" : "max-h-0"}`}
      >
        <div className="px-4 pt-4 pb-8 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={getLinkStyle(link.to)}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-white/5">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">
                  {user?.username.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-white">
                    {user?.username}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {user?.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 text-red-400 bg-red-400/10 rounded-xl"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
