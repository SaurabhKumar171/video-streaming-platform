import React from "react";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  SortAsc,
  Layers,
  RefreshCcw,
} from "lucide-react";

const LibraryFilters = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  videoCount,
}) => {
  const resetFilters = () =>
    setFilters({ search: "", category: "", safety: "", sortBy: "newest" });

  return (
    <div className="mb-10 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Tenant Content Hub
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage {videoCount} assets
          </p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-3 text-gray-400 size-5" />
            <input
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl w-full outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-sm transition-all shadow-sm ${
              showFilters ? "bg-gray-900 text-white" : "bg-white text-gray-600"
            }`}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5 animate-in slide-in-from-top-4 duration-300">
          <FilterSelect
            label="Safety Status"
            icon={<ShieldCheck size={14} />}
            value={filters.safety}
            onChange={(v) => setFilters({ ...filters, safety: v })}
            options={[
              { l: "All", v: "" },
              { l: "Safe", v: "safe" },
              { l: "Flagged", v: "flagged" },
            ]}
          />
          <FilterSelect
            label="Sort By"
            icon={<SortAsc size={14} />}
            value={filters.sortBy}
            onChange={(v) => setFilters({ ...filters, sortBy: v })}
            options={[
              { l: "Recent", v: "newest" },
              { l: "Oldest", v: "oldest" },
              { l: "Size", v: "largest" },
            ]}
          />
          <FilterSelect
            label="Category"
            icon={<Layers size={14} />}
            value={filters.category}
            onChange={(v) => setFilters({ ...filters, category: v })}
            options={[
              { l: "All", v: "" },
              { l: "Tutorial", v: "tutorial" },
              { l: "Meeting", v: "meeting" },
              { l: "Marketing", v: "marketing" },
            ]}
          />
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-3 text-xs font-black text-red-500 uppercase flex items-center justify-center gap-2 hover:bg-red-50 rounded-xl transition-all"
            >
              <RefreshCcw size={14} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ label, icon, value, onChange, options }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {icon} {label}
    </label>
    <select
      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-200 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.v} value={opt.v}>
          {opt.l}
        </option>
      ))}
    </select>
  </div>
);

export default LibraryFilters;
