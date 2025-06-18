import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@cowco.com",
    password: "admin123",
    role: "Admin",
  },
  {
    id: 2,
    name: "Farm Manager",
    email: "manager@cowco.com",
    password: "manager123",
    role: "Farm Manager",
  },
  {
    id: 3,
    name: "Veterinarian",
    email: "vet@cowco.com",
    password: "vet123",
    role: "Veterinarian",
  },
  {
    id: 4,
    name: "Worker User",
    email: "worker@cowco.com",
    password: "worker123",
    role: "Worker",
  },
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    // Load from localStorage or use initialUsers
    const stored = localStorage.getItem("cowco_users");
    return stored ? JSON.parse(stored) : initialUsers;
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("cowco_current_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("cowco_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cowco_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cowco_current_user");
    }
  }, [user]);

  // Signup adds a new user if email not taken
  const signup = ({ name, email, password, role }) => {
    if (users.find((u) => u.email === email)) {
      return { error: "Email already registered." };
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  // Login checks email and password
  const login = ({ email, password }) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { error: "Invalid credentials" };
    setUser(found);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
