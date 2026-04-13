import { createContext, useState } from "react";
import { userProfile as initialData } from "../data/userData";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === "admin@gmail.com" && password === "admin") {
      setUser(initialData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const updateUser = (newInfo) => {
    setUser((prev) => ({
      ...prev,
      ...newInfo,
      stats: { ...prev?.stats, ...newInfo.stats },
      details: { ...prev?.details, ...newInfo.details },
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
