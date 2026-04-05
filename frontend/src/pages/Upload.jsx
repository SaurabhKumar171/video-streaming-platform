import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import {
  Upload as UploadIcon,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import API from "../api/axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Upload = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Helper for cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const socket = io(apiUrl, {
      withCredentials: true,
      auth: { token: getCookie("token") },
    });

    socket.on("video_progress", (data) => {
      setProgress(data.progress);
      setStatus(data.status || "Analysing frames...");
    });

    socket.on("video_finished", (data) => {
      setProgress(100);
      setStatus(data.isFlagged ? "Flagged for Review" : "Analysis Complete");
      setUploading(false);
      setShowSuccess(true);

      // Auto-reset after 5 seconds
      setTimeout(() => {
        handleReset();
      }, 5000);
    });

    return () => socket.disconnect();
  }, []);

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setStatus("");
    setUploading(false);
    setShowSuccess(false);
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const startUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(5); // Initial jump
    setStatus("Initiating secure upload...");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", file.name);
    formData.append("description", "Uploaded via Multi-Tenant Portal");
    formData.append("category", "tutorial");

    try {
      await API.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Upload successful. Waiting for AI analysis...");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-10 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 lg:p-12 border-b border-gray-50 bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Content Lab
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                Upload & Auto-Optimise organization assets
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 text-white">
              <UploadIcon size={24} />
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          {!file ? (
            /* --- Dropzone Area --- */
            <label className="group relative flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2rem] p-16 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={onFileChange}
              />
              <div className="bg-gray-50 group-hover:bg-blue-100 p-6 rounded-full transition-colors mb-4">
                <FileVideo className="text-gray-300 group-hover:text-blue-600 size-10" />
              </div>
              <p className="text-lg font-bold text-gray-700">
                Drop your video here
              </p>
              <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-black text-[10px]">
                Max size 500MB • MP4, MKV
              </p>
            </label>
          ) : (
            /* --- File Selected / Uploading View --- */
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-blue-600 p-3 rounded-xl text-white">
                  <FileVideo size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {!uploading && !showSuccess && (
                  <button
                    onClick={handleReset}
                    className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Progress Bar Logic */}
              {(uploading || progress > 0) && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      {progress < 100 ? (
                        <Loader2
                          className="animate-spin text-blue-600"
                          size={16}
                        />
                      ) : (
                        <CheckCircle2 className="text-green-500" size={16} />
                      )}
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                        {status}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-gray-900">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-50">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        status.includes("⚠️") || status.includes("Flagged")
                          ? "bg-red-500"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!uploading && !showSuccess && (
                <button
                  onClick={startUpload}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  Start Secure Upload
                </button>
              )}

              {/* Success Notification */}
              {showSuccess && (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4 animate-in zoom-in duration-300">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-900">Task Successful</p>
                    <p className="text-sm text-green-700">
                      Video processed and available in library.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-black uppercase text-green-700 hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-12 py-6 bg-gray-50/30 text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            Multi-Tenant Isolated Storage
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
