import React, { useState } from "react";
import {
  Bell,
  User,
  ChevronDown,
  ChevronRight,
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
  Scale,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const EmployerSidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const [workshopsExpanded, setWorkshopsExpanded] = useState(false);
  const [freelanceExpanded, setFreelanceExpanded] = useState(false);
  const [disputesExpanded, setDisputesExpanded] = useState(false);

  // Get the current path and remove leading/trailing slashes
  const currentPath = location.pathname.replace(/^\/|\/$/g, "");

  // Auto-expand sections if one of their sub-items is active
  React.useEffect(() => {
    const isWorkshopSubItemActive = menuItems
      .find((item) => item.id === "workshops")
      ?.subItems?.some(
        (subItem) =>
          currentPath === `employer-dashboard/${subItem.id}` ||
          currentPath === subItem.id
      );

    if (isWorkshopSubItemActive) {
      setWorkshopsExpanded(true);
    }

    const isFreelanceSubItemActive = menuItems
      .find((item) => item.id === "employer-dashboard/freelance-feed")
      ?.subItems?.some(
        (subItem) =>
          currentPath === `employer-dashboard/${subItem.id}` ||
          currentPath === subItem.id
      );

    if (isFreelanceSubItemActive) {
      setFreelanceExpanded(true);
    }

    const isDisputeSubItemActive = menuItems
      .find((item) => item.id === "disputes")
      ?.subItems?.some(
        (subItem) =>
          currentPath === `employer-dashboard/${subItem.id}` ||
          currentPath === subItem.id
      );

    if (isDisputeSubItemActive) {
      setDisputesExpanded(true);
    }
  }, [currentPath]);

  const menuItems = [
    { id: "employer-dashboard", label: "Dashboard", icon: Home, path: "/employer-dashboard" },
    {
      id: "workshops",
      label: "Workshops",
      icon: BookOpen,
      hasDropdown: true,
      subItems: [
        { id: "my-workshops", label: "My Workshops", path: "/employer-dashboard/my-workshops" },
        { id: "create-workshop", label: "Create Workshop", path: "/employer-dashboard/create-workshop" },
        { id: "workshops-requests", label: "Workshop Requests", path: "/employer-dashboard/workshops-requests" },
      ],
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: Scale,
      hasDropdown: true,
      subItems: [
        { id: "disputes", label: "All Disputes", path: "/employer-dashboard/disputes" },
        { id: "disputes/raise", label: "Raise New Dispute", path: "/employer-dashboard/disputes/raise" },
        { id: "disputes/rewards", label: "Token Rewards", path: "/employer-dashboard/disputes/rewards" },
      ],
    },
    {
      id: "employer-dashboard/collaborate",
      label: "Collaborate",
      icon: Users,
      path: "/employer-dashboard/collaborate",
    },
    {
      id: "employer-dashboard/freelance-feed",
      label: "Freelance / Internships",
      icon: Briefcase,
      hasDropdown: true,
      subItems: [
        { id: "freelance-feed", label: "Post Jobs", path: "/employer-dashboard/freelance-feed" },
        { id: "freelance-feed/invite", label: "Job Invites", path: "/employer-dashboard/freelance-feed/invite" },
      ],
    },
    {
      id: "employer-dashboard/profile",
      label: "Profile",
      icon: User,
      path: "/employer-dashboard/profile",
    },
  ];

  const handleDropdownClick = (id) => {
    switch (id) {
      case "workshops":
        setWorkshopsExpanded(!workshopsExpanded);
        break;
      case "employer-dashboard/freelance-feed":
        setFreelanceExpanded(!freelanceExpanded);
        break;
      case "disputes":
        setDisputesExpanded(!disputesExpanded);
        break;
      default:
        break;
    }
  };

  const getDropdownState = (id) => {
    switch (id) {
      case "workshops":
        return workshopsExpanded;
      case "employer-dashboard/freelance-feed":
        return freelanceExpanded;
      case "disputes":
        return disputesExpanded;
      default:
        return false;
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">ChalkBox</h1>
          {isMobile && (
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            const isSubItemActive = item.subItems?.some(
              (subItem) =>
                currentPath === `employer-dashboard/${subItem.id}` ||
                currentPath === subItem.id
            );
            const isExpanded = getDropdownState(item.id);

            return (
              <div key={item.id}>
                {item.hasDropdown ? (
                  <button
                    onClick={() => handleDropdownClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive || isSubItemActive
                        ? "text-white shadow-lg"
                        : "text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                    style={
                      isActive || isSubItemActive
                        ? { backgroundColor: "#2A66DE" }
                        : {}
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                    style={isActive ? { backgroundColor: "#2A66DE" } : {}}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}

                {item.hasDropdown && isExpanded && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.path}
                        className={`block px-4 py-2 rounded-lg text-sm ${
                          currentPath === `employer-dashboard/${subItem.id}` ||
                          currentPath === subItem.id
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              // Handle logout
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerSidebar; 