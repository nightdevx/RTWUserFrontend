import { create } from "zustand";
import { apiWithoutAuth } from "../config/axios.config";

const addVideo = async (set, videoFile) => {
  set({ videoLoading: true, error: null });
  try {
    const formData = new FormData();
    formData.append("video", videoFile);

    const response = await apiWithoutAuth.post("/videos", formData);

    return response.data.files[0].fileId;
  } catch (error) {
    set({ error: error.message, videoLoading: false });
  }
};

const useVideoStore = create((set) => ({
  videoLoading: false,
  error: null,
  addVideo: (videoFile) => addVideo(set, videoFile),
}));

export default useVideoStore;
