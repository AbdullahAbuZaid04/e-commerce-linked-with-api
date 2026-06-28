import React, { createContext, useContext, useState } from "react";
import { initialUsers } from "../data/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return false;
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
    return true;
  };

  const register = (name, email, password) => {
    if (users.find(u => u.email === email)) return false;
    const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
    const newUser = { id: maxId + 1, name, email, password, role: "user" };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== parseInt(id)));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
