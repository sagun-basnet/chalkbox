import React, { useState } from "react";
import {
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Home,
  Users,
  Briefcase,
  Award,
  LogOut,
  Coins,
  BookOpen,
  Star,
  TrendingUp,
  Plus,
  Eye,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

// Dashboard Card Component

// Main Dashboard Component
const ChalkBoxDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
          activeRoute="dashboard"
        />

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Topbar */}
          <Topbar
            pageTitle="Dashboard"
            onMenuToggle={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />

          {/* Dashboard Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChalkBoxDashboard;
