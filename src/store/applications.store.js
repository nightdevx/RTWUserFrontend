import { create } from "zustand";
import { apiWithoutAuth } from "../config/axios.config";

const addApplication = async (set, newCollection) => {
  set({ loading: true, error: null });
  try {
    const response = await apiWithoutAuth.post(`/application`, newCollection);
    set((state) => ({
      applications: [...state.applications, newCollection],
      loading: false,
    }));
    return response.data._id;
  } catch (error) {
    set({ error: error.message, loading: false });
  }
};

const updateApplication = async (set, id, updatedCollection) => {
  set({ loading: true, error: null });
  try {
    const response = await apiWithoutAuth.put(
      `/application/${id}`,
      updatedCollection
    );
    set((state) => ({
      applications: state.applications.map((collection) =>
        collection._id === id ? response.data : collection
      ),
      loading: false,
    }));
  } catch (error) {
    set({ error: error.message, loading: false });
  }
};

const useApplicationsStore = create((set) => ({
  applications: [],
  loading: false,
  error: null,
  addApplication: (newCollection) => addApplication(set, newCollection),
  updateApplication: (id, updatedCollection) =>
    updateApplication(set, id, updatedCollection),
}));

export default useApplicationsStore;
