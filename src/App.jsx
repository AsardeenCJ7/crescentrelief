import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
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
        <div className={`transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
          <AppRoutes darkMode={darkMode} toggleDark={toggleDark} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
