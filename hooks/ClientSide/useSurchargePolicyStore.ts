import { useEffect } from "react";
import { create } from "zustand";
import type { SurchargePolicy } from "@/lib/surcharge-policy.types";

interface SurchargePolicyState {
  policies: SurchargePolicy[];
  loading: boolean;
  error: string | null;
  fetchPolicies: () => void;
  setPolicies: (data: SurchargePolicy[]) => void;
}

export const useSurchargePolicyStore = create<SurchargePolicyState>((set) => ({
  policies: [],
  loading: false,
  error: null,
  fetchPolicies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:4000/policy/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      set({ policies: data.policies, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Lỗi tải chính sách phụ thu", loading: false });
    }
  },
  setPolicies: (data) => set({ policies: data }),
}));

// Custom hook: chỉ fetch 1 lần khi lần đầu gọi
export function useSurchargePoliciesOnce() {
  const { policies, loading, error, fetchPolicies } = useSurchargePolicyStore();
  useEffect(() => {
    if (policies.length === 0 && !loading && !error) {
      fetchPolicies();
    }
  }, [policies.length, loading, error, fetchPolicies]);
  return { policies, loading, error };
}
