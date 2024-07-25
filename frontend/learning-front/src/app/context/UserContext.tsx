/** @format */
"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  userId: string | null;
  setUserId: (userId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedUserId = sessionStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  const handleSetUserId = (id: string) => {
    setUserId(id);
    sessionStorage.setItem("userId", id);
  };

  const logout = () => {
    setUserId(null);
    sessionStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider
      value={{ userId, setUserId: handleSetUserId, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
