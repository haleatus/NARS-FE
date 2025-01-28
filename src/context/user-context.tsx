"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "../core/types/user/user.interface";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/app/actions/user/auth/get-current-user-from-api.action";

interface UserContextValue {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      router.push("/signin"); // Optional: redirect on auth failure
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
