import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingAssistant from "../ui/FloatingAssistant";

const PublicLayout = ({ darkMode, toggleDark }) => {
  return (
    <>
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <FloatingAssistant />
    </>
  );
};

export default PublicLayout;
