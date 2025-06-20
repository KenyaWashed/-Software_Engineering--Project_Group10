import { useEffect } from "react";
import { create } from "zustand";
import type { RoomType } from "@/lib/room.types";

interface RoomsDataState {
  roomsData: RoomType[];
  loading: boolean;
  error: string | null;
  fetchRoomsData: () => void;
  setRoomsData: (data: RoomType[]) => void;
}

export const useRoomsDataStore = create<RoomsDataState>((set) => ({
  roomsData: [],
  loading: false,
  error: null,
  fetchRoomsData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:4000/room/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      set({ roomsData: data.roomType, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Lỗi tải dữ liệu phòng", loading: false });
    }
  },
  setRoomsData: (data) => set({ roomsData: data }),
}));

// Custom hook: chỉ fetch 1 lần khi lần đầu gọi
export function useRoomsDataOnce() {
  const { roomsData, loading, error, fetchRoomsData } = useRoomsDataStore();
  useEffect(() => {
    if (roomsData.length === 0 && !loading && !error) {
      fetchRoomsData();
    }
  }, [roomsData.length, loading, error, fetchRoomsData]);
  return { roomsData, loading, error };
}
