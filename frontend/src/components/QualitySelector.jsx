const QualitySelector = ({ streams, current, onChange }) => (
  <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-md border border-white/10">
    {["original", "720p", "480p"].map((q) => (
      <button
        key={q}
        disabled={q !== "original" && !streams?.[q]}
        onClick={() => onChange(q)}
        className={`flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded ${
          current === q
            ? "bg-white text-black shadow-lg"
            : "text-gray-400 hover:text-white disabled:opacity-20"
        }`}
      >
        {q}
      </button>
    ))}
  </div>
);

export default QualitySelector;
