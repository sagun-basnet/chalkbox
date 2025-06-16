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
import { useState } from "react";
const Topbar = ({ pageTitle, onMenuToggle, isMobile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Token Balance */}
          <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Coins className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              1,250 tokens
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">RK</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">View Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Topbar;
