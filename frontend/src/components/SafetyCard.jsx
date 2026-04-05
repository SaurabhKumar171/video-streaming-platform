import { AlertTriangle, ShieldCheck } from "lucide-react";

const SafetyCard = ({ isFlagged, score }) => (
  <div
    className={`p-6 rounded-md border-l-4 transition-all duration-500 bg-[#141414] ring-1 ring-white/10 ${
      isFlagged
        ? "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        : "border-green-500"
    }`}
  >
    <div className="flex items-center gap-3 mb-4 text-xs font-black uppercase tracking-widest">
      {isFlagged ? (
        <AlertTriangle className="text-red-600" />
      ) : (
        <ShieldCheck className="text-green-500" />
      )}
      <span className={isFlagged ? "text-red-600" : "text-green-500"}>
        AI Safety Analysis
      </span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black text-white">{score}%</span>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        Trust Score
      </span>
    </div>
  </div>
);

export default SafetyCard;
