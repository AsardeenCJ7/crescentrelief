import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import FloatingAssistant from "./components/ui/FloatingAssistant";
import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("cr_dark") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("cr_dark", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDark = () => setDarkMode((prev) => !prev);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={`min-h-screen bg-background flex flex-col transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
          <Navbar darkMode={darkMode} toggleDark={toggleDark} />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <Footer />
          <FloatingAssistant />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
