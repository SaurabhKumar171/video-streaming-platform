const ActivityRow = ({ title, time, type }) => {
  const dotColor = {
    success: "bg-green-500",
    info: "bg-blue-500",
    alert: "bg-red-500",
  }[type];
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${dotColor} shadow-lg`}></div>
        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
          {title}
        </span>
      </div>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        {time}
      </span>
    </div>
  );
};

export default ActivityRow;
