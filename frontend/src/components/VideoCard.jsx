import React from "react";
import { Link } from "react-router-dom";
import { Play, AlertCircle, Trash2, Edit3 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const VideoCard = ({ video, canManage, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-[#141414] rounded-xl overflow-hidden transition-all duration-500 hover:z-30 hover:scale-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5">
      {/* --- Admin Action Overlay --- */}
      {canManage && (
        <div className="absolute top-3 right-3 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Critical: Stops the Link from triggering
              onEdit(video);
            }}
            className="p-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/10 hover:bg-blue-600 transition-colors"
            title="Edit Video"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(video);
            }}
            className="p-2 bg-white/10 backdrop-blur-md text-red-500 rounded-lg border border-white/10 hover:bg-red-600 hover:text-white transition-colors"
            title="Delete Video"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* --- Thumbnail Section --- */}
      <div className="aspect-video relative overflow-hidden bg-black">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400/000000/ffffff?text=No+Preview";
          }}
        />

        {/* Cinematic Play Button */}
        <Link
          to={`/watch/${video._id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center pl-1 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="text-black fill-black size-6" />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          {video.isFlagged && (
            <div className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
              <AlertCircle size={10} /> SENSITIVE
            </div>
          )}
          <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded border border-white/10">
            HD 4K
          </span>
        </div>
      </div>

      {/* --- Content Info --- */}
      <div className="p-4 bg-[#181818]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-black text-white truncate w-full group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="text-gray-500 uppercase tracking-widest">
              {video.category}
            </span>
          </div>
          <span className="text-[9px] font-black text-gray-600 uppercase">
            {new Date(video.createdAt).getFullYear()}
          </span>
        </div>
      </div>

      {/* Subtle Hover Reveal Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600/50 rounded-xl pointer-events-none transition-colors" />
    </div>
  );
};

export default VideoCard;
