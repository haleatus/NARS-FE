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
import { Admin } from "@/core/types/admin.interface";
import getCurrentAdmin from "@/app/actions/admin/auth/get-current-admin.action";

interface AdminContextValue {
  admin: Admin | null;
  loading: boolean;
  refetchAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAdmin = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedAdmin = await getCurrentAdmin();

      if (fetchedAdmin?.data) {
        setAdmin(fetchedAdmin.data.admin);
      } else {
        // If no data or error, set ambulance to null
        setAdmin(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setAdmin(null);
      router.push("/admin-signin"); // Optional: redirect on auth failure
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        refetchAdmin: fetchAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within a AdminProvider");
  }
  return context;
};
