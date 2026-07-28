import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const INITIAL_MOCK_USERS = [
  { id: 1, fullName: "Super Admin", email: "superadmin@crescentrelief.org", role: "superadmin", phone: "+44 7000 111111", totalDonated: 0, campaignsSupported: 0, joinedDate: "2024-01-01", status: "Active" },
  { id: 2, fullName: "System Admin", email: "admin@crescentrelief.org", role: "admin", phone: "+44 7000 222222", totalDonated: 0, campaignsSupported: 0, joinedDate: "2024-02-01", status: "Active" },
  { id: 3, fullName: "Asardeen MA", email: "user@example.com", role: "donor", phone: "+44 7000 123456", totalDonated: 2450, campaignsSupported: 7, joinedDate: "2024-03-15", status: "Active" },
  { id: 4, fullName: "Sarah Khan", email: "sarah.k@example.com", role: "donor", phone: "+44 7000 333333", totalDonated: 450, campaignsSupported: 4, joinedDate: "2024-02-10", status: "Active" },
];

export const AuthProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Store users list
  const [usersList, setUsersList] = useState(() => {
    try {
      const stored = localStorage.getItem("cr_users_list");
      return stored ? JSON.parse(stored) : INITIAL_MOCK_USERS;
    } catch {
      return INITIAL_MOCK_USERS;
    }
  });

  // Store tasks list
  const [tasksList, setTasksList] = useState(() => {
    try {
      const stored = localStorage.getItem("cr_tasks_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cr_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("cr_users_list", JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem("cr_tasks_list", JSON.stringify(tasksList));
  }, [tasksList]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cr_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cr_user");
    }
  }, [user]);

  const login = (email, password) => {
    const foundUser = usersList.find(u => u.email === email);
    if (!foundUser) {
      throw new Error("User not found.");
    }
    
    // Check custom password if set, else fallback to 'password123'
    const validPassword = foundUser.password || "password123";
    if (password !== validPassword) {
      throw new Error("Invalid password.");
    }

    if (foundUser.status === "Pending Setup") {
      throw new Error("Account pending setup. Please check your email.");
    }

    setUser(foundUser);
    return foundUser;
  };

  const googleAuth = () => {
    const defaultGoogleUser = {
      id: Date.now(),
      fullName: "Google User",
      email: "googleuser@example.com",
      role: "donor",
      phone: "",
      totalDonated: 0,
      campaignsSupported: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };
    setUser(defaultGoogleUser);
    return defaultGoogleUser;
  };

  const register = (formData) => {
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "",
      password: formData.password, // Set their explicit password
      role: "donor",
      totalDonated: 0,
      campaignsSupported: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserRole = (userId, newRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const inviteAdmin = (fullName, email) => {
    const newAdmin = {
      id: Date.now(),
      fullName,
      email,
      role: "admin",
      phone: "",
      totalDonated: 0,
      campaignsSupported: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: "Pending Setup",
    };
    setUsersList(prev => [...prev, newAdmin]);
    return newAdmin;
  };

  const setPassword = (userId, newPassword) => {
    setUsersList(prev => prev.map(u => 
      u.id === parseInt(userId) ? { ...u, password: newPassword, status: "Active" } : u
    ));
  };

  const updateProfile = (userId, newData) => {
    setUsersList(prev => prev.map(u => 
      u.id === userId ? { ...u, ...newData } : u
    ));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, ...newData }));
    }
  };

  const assignTask = (adminId, title, description) => {
    const newTask = {
      id: Date.now(),
      adminId,
      title,
      description,
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };
    setTasksList(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId, status) => {
    setTasksList(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const deleteUser = (userId) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, usersList, tasksList,
      login, register, googleAuth, logout, isAuthenticated,
      showLoginModal, setShowLoginModal, showRegisterModal, setShowRegisterModal,
      updateUserRole, inviteAdmin, setPassword, updateProfile, assignTask, updateTaskStatus, deleteUser
    }}>
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
