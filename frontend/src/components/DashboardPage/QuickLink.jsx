import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const QuickLink = ({ to, label, bg, text }) => (
  <Link
    to={to}
    className={`${bg} ${text} w-full flex items-center justify-between p-5 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 group`}
  >
    <span className="text-xs font-black uppercase tracking-widest">
      {label}
    </span>
    <ChevronRight
      size={18}
      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
    />
  </Link>
);

export default QuickLink;
