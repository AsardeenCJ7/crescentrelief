import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const MOCK_USER = {
  id: 1,
  fullName: "Asardeen MA",
  email: "asardeen@example.com",
  phone: "+44 7000 123456",
  avatar: null, // Will use initials fallback
  role: "donor",
  totalDonated: 2450,
  campaignsSupported: 7,
  joinedDate: "2024-03-15",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cr_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("cr_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cr_user");
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login — in production this would hit your API
    setUser({ ...MOCK_USER, email });
    return true;
  };

  const googleAuth = () => {
    // Mock Google auth — in production this uses Google OAuth API
    setUser({
      ...MOCK_USER,
      email: "googleuser@example.com",
      fullName: "Google User",
    });
    return true;
  };

  const register = (formData) => {
    // Mock register — in production this would hit your API
    setUser({
      ...MOCK_USER,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, googleAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
