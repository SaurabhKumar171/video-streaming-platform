import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export const EditVideoModal = ({
  isOpen,
  onClose,
  video,
  setVideo,
  onSave,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Video Details">
    <form onSubmit={onSave} className="space-y-5">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Title
        </label>
        <input
          className="w-full p-3 bg-gray-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
          value={video?.title || ""}
          onChange={(e) => setVideo({ ...video, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Category
        </label>
        <select
          className="w-full p-3 bg-gray-50 border rounded-xl font-bold outline-none"
          value={video?.category || "tutorial"}
          onChange={(e) => setVideo({ ...video, category: e.target.value })}
        >
          <option value="tutorial">Tutorial</option>
          <option value="meeting">Meeting</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
      <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
        Save Changes
      </button>
    </form>
  </Modal>
);

export const DeleteVideoModal = ({ isOpen, onClose, video, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
    <div className="text-center">
      <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <AlertTriangle size={32} />
      </div>
      <p className="text-gray-600 mb-8 font-medium">
        Delete{" "}
        <span className="font-black text-gray-900">"{video?.title}"</span>?
        <span className="text-xs text-red-500 font-bold mt-2 block italic underline">
          Permanent server-side removal.
        </span>
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 p-4 bg-gray-100 text-gray-500 rounded-xl font-black uppercase tracking-widest text-xs"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 p-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
);
