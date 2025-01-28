"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import getCurrentAmbulance from "@/app/actions/ambulance/auth/get-current-ambulance.action";
import { Ambulance } from "@/core/types/ambulance.interface";

interface AmbulanceContextValue {
  ambulance: Ambulance | null;
  loading: boolean;
  refetchAmbulance: () => Promise<void>;
}

const AmbulanceContext = createContext<AmbulanceContextValue | undefined>(
  undefined
);

export const AmbulanceProvider = ({ children }: { children: ReactNode }) => {
  const [ambulance, setAmbulance] = useState<Ambulance | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAmbulance = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedAmbulance = await getCurrentAmbulance();
      setAmbulance(fetchedAmbulance.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setAmbulance(null);
      router.push("/ambulance-signin"); // Optional: redirect on auth failure
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAmbulance();
  }, [fetchAmbulance]);

  return (
    <AmbulanceContext.Provider
      value={{
        ambulance,
        loading,
        refetchAmbulance: fetchAmbulance,
      }}
    >
      {children}
    </AmbulanceContext.Provider>
  );
};

export const useAmbulance = () => {
  const context = useContext(AmbulanceContext);
  if (!context) {
    throw new Error("useAmbulance must be used within a AmbulanceProvider");
  }
  return context;
};
