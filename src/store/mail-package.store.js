import { create } from "zustand";
import { apiWithoutAuth } from "../config/axios.config";

const getMailData = async (id, mail) => {
  const response = await apiWithoutAuth.get(
    `/mail-packages/mail/${id}/${mail}`
  );
  if (response.data) {
    return response.data;
  } else {
    return null;
  }
};

const markInterviewAsDone = async (set, interviewId, mail) => {
  set({ loading: false, error: null });
  try {
    await apiWithoutAuth.put(`/mail-packages/mail/${interviewId}/${mail}`);
  } catch (error) {
    set({ error: error.message, loading: false });
  }
};

const useMailPackageStore = create((set) => ({
  loading: false,
  error: null,

  getMailData: (id, mail) => getMailData(id, mail),
  markInterviewAsDone: (interviewId, mail) =>
    markInterviewAsDone(set, interviewId, mail),
}));

export default useMailPackageStore;

