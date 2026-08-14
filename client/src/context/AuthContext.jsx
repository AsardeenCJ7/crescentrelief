import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for token on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.user);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("token", response.accessToken);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const referralCode = localStorage.getItem("referralCode") || undefined;
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        referralCode
      });
      localStorage.removeItem("referralCode");
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await authService.verifyOtp({ email, otp });
      localStorage.setItem("token", response.accessToken);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await authService.resendOtp({ email });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const googleAuth = async (googleUserData) => {
    try {
      if (!googleUserData) throw new Error("Google user data is required.");
      const referralCode = localStorage.getItem("referralCode") || undefined;
      const response = await authService.google({ ...googleUserData, referralCode });
      localStorage.removeItem("referralCode");
      localStorage.setItem("token", response.accessToken);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem("token")) {
        await authService.logout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, loading,
      login, register, verifyOtp, resendOtp, googleAuth, logout, isAuthenticated,
      showLoginModal, setShowLoginModal, showRegisterModal, setShowRegisterModal,
      usersList: [], tasksList: [],
    }}>
      {!loading && children}
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
