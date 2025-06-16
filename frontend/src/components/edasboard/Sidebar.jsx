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
  Building2,
  UserPlus,
  Calendar,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, isMobile, activeRoute = "dashboard" }) => {
  const [jobsExpanded, setJobsExpanded] = useState(false);
  const [workshopsExpanded, setWorkshopsExpanded] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [collabExpanded, setCollabExpanded] = useState(false);
  const [contractsExpanded, setContractsExpanded] = useState(false);

  const menuItems = [
    { id: "employer-dashboard", label: "Dashboard", icon: Home },
    {
      id: "jobs",
      label: "Job Management",
      icon: Briefcase,
      hasDropdown: true,
      subItems: [
        { id: "post-job", label: "Post New Job" },
        { id: "active-jobs", label: "Active Jobs" },
        { id: "archived-jobs", label: "Archived Jobs" },
      ],
    },
    {
      id: "contracts",
      label: "Contracts",
      icon: FileText,
      hasDropdown: true,
      subItems: [
        { id: "contracts", label: "All Contracts" },
        { id: "contracts/active", label: "Active Contracts" },
        { id: "contracts/completed", label: "Completed Contracts" },
      ],
    },
    {
      id: "workshops",
      label: "Workshops",
      icon: BookOpen,
      hasDropdown: true,
      subItems: [
        { id: "create-workshop", label: "Create Workshop" },
        { id: "my-workshops", label: "My Workshops" },
        { id: "workshop-requests", label: "Workshop Requests" },
      ],
    },
    {
      id: "collaborate",
      label: "Collaborate",
      icon: BookOpen,
      hasDropdown: true,
      subItems: [
        {
          id: "post-open-source-project",
          label: "Create open source project",
        },
        {
          id: "opensource-contributer",
          label: "Contributer",
        },
      ],
    },
    { id: "candidates", label: "Talent Pool", icon: Users },
    // {
    //   id: "analytics",
    //   label: "Analytics",
    //   icon: BarChart3,
    //   hasDropdown: true,
    //   subItems: [
    //     { id: "hiring-metrics", label: "Hiring Metrics" },
    //     { id: "workshop-analytics", label: "Workshop Analytics" },
    //     { id: "engagement-reports", label: "Engagement Reports" },
    //   ],
    // },
    {
      id: "employer-dashboard/company-profile",
      label: "Company Profile",
      icon: Building2,
    },
  ];

  const handleDropdownClick = (dropdownType) => {
    switch (dropdownType) {
      case "jobs":
        setJobsExpanded(!jobsExpanded);
        break;
      case "workshops":
        setWorkshopsExpanded(!workshopsExpanded);
        break;
      case "analytics":
        setAnalyticsExpanded(!analyticsExpanded);
        break;
      case "collaborate":
        setCollabExpanded(!collabExpanded);
        break;
      case "contracts":
        setContractsExpanded(!contractsExpanded);
        break;
      default:
        break;
    }
  };

  const getDropdownState = (itemId) => {
    switch (itemId) {
      case "jobs":
        return jobsExpanded;
      case "workshops":
        return workshopsExpanded;
      case "analytics":
        return analyticsExpanded;
      case "collaborate":
        return collabExpanded;
      case "contracts":
        return contractsExpanded;
      default:
        return false;
    }
  };

  const SidebarContent = () => (
    <div className="h-full bg-slate-50 border-r border-gray-200">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#2A66DE" }}
          >
            <span className="text-white font-bold text-lg">CB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800">ChalkBox</span>
            <span className="text-xs font-medium" style={{ color: "#2A66DE" }}>
              Employer
            </span>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="ml-auto p-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            const isSubItemActive = item.subItems?.some(
              (subItem) => activeRoute === subItem.id
            );
            const isExpanded = getDropdownState(item.id);

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
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
                    to={`/${item.id}`}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    }`}
                    style={isActive ? { backgroundColor: "#2A66DE" } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}

                {/* Dropdown Sub-items */}
                {item.hasDropdown && isExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = activeRoute === subItem.id;
                      return (
                        <Link
                          key={subItem.id}
                          to={`/employer-dashboard/${subItem.id}`}
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? "font-medium text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          }`}
                          style={
                            isSubActive ? { backgroundColor: "#2A66DE" } : {}
                          }
                        >
                          <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
                          <span className="text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              to="/employer/post-job"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-white rounded-lg transition-all duration-200"
              style={{ color: "#2A66DE" }}
              onMouseEnter={(e) =>
                (e.target.closest("a").style.backgroundColor = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.target.closest("a").style.backgroundColor = "transparent")
              }
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Post Job</span>
            </Link>
            <Link
              to="/employer/create-workshop"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-white rounded-lg transition-all duration-200"
              style={{ color: "#2A66DE" }}
              onMouseEnter={(e) =>
                (e.target.closest("a").style.backgroundColor = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.target.closest("a").style.backgroundColor = "transparent")
              }
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Create Workshop</span>
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-800 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent />
        </div>
      </>
    );
  }

  return (
    <div className="w-80 h-screen sticky top-0">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
