const StatCard = ({ icon, label, value, suffix, theme }) => {
  const themes = {
    blue: "bg-blue-600 text-white shadow-blue-200",
    indigo: "bg-indigo-600 text-white shadow-indigo-200",
    amber: "bg-white text-slate-900 border-slate-200",
  };

  return (
    <div
      className={`${themes[theme]} p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all duration-500 group border border-transparent`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${theme === "amber" ? "bg-amber-100 text-amber-600" : "bg-white/20 text-white"}`}
      >
        {icon}
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === "amber" ? "text-slate-400" : "text-white/60"}`}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black tracking-tighter">{value}</p>
        <p
          className={`text-xs font-bold uppercase ${theme === "amber" ? "text-slate-400" : "text-white/40"}`}
        >
          {suffix}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
