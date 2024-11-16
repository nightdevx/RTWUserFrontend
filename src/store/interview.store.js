import { create } from "zustand";
import { apiWithAuth, apiWithoutAuth } from "../config/axios.config";

const fetchInterviewByName = async (set, name) => {
  console.log("fetchInterviewByName");
  set({ interview: null, loading: true, error: null });
  try {
    const response = await apiWithoutAuth.get(`/interviews/name/${name}`);
    set({ interview: response.data, loading: false });
  } catch (error) {
    console.error(`Error fetching interview for name ${name}:`, error);
    set({ error, loading: false });
  }
};

const useInterviewStore = create((set) => ({
  interview: { _id: "", name: "", packages: [] },
  loading: false,
  error: null,

  fetchInterviewByName: (name) => fetchInterviewByName(set, name),
}));

export default useInterviewStore;
