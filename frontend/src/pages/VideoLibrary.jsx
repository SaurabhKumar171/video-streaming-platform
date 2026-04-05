import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import VideoCard from "../components/VideoCard";
import LibraryFilters from "../components/LibraryFilters";
import { EditVideoModal, DeleteVideoModal } from "../components/LibraryModals";

const VideoLibrary = () => {
  const { user } = useSelector((state) => state.auth);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    safety: "",
    sortBy: "newest",
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/videos?${params}`);
      setVideos(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchVideos(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/videos/${selectedVideo._id}`, selectedVideo);
      setModalMode(null);
      fetchVideos();
    } catch (err) {
      alert("Update failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/videos/${selectedVideo._id}`);
      setVideos(videos.filter((v) => v._id !== selectedVideo._id));
      setModalMode(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <LibraryFilters
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        videoCount={videos.length}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            canManage={user?.role === "admin" || user?.role === "editor"}
            onEdit={(v) => {
              setSelectedVideo(v);
              setModalMode("edit");
            }}
            onDelete={(v) => {
              setSelectedVideo(v);
              setModalMode("delete");
            }}
          />
        ))}
      </div>

      <EditVideoModal
        isOpen={modalMode === "edit"}
        onClose={() => setModalMode(null)}
        video={selectedVideo}
        setVideo={setSelectedVideo}
        onSave={handleUpdate}
      />

      <DeleteVideoModal
        isOpen={modalMode === "delete"}
        onClose={() => setModalMode(null)}
        video={selectedVideo}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default VideoLibrary;
