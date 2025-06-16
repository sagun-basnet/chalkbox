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
  Calendar,
  Clock,
  Target,
  BarChart3,
  Activity,
  Zap,
  ChevronRight,
  Filter,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  gradient = false,
  value,
  change,
  changeType = "positive"
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        gradient
          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-500"
          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-50"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${
            gradient ? "bg-white/20" : "bg-blue-50"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${gradient ? "text-white" : "text-blue-600"}`}
          />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeType === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            <TrendingUp className={`w-3 h-3 ${changeType === "negative" ? "rotate-180" : ""}`} />
            <span>{change}</span>
          </div>
        )}
      </div>

      {value && (
        <div className={`text-2xl font-bold mb-2 ${gradient ? "text-white" : "text-gray-800"}`}>
          {value}
        </div>
      )}

      <h3
        className={`text-lg font-semibold mb-2 ${
          gradient ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <p className={`text-sm ${gradient ? "text-blue-100" : "text-gray-600"}`}>
        {description}
      </p>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, change, changeType = "positive" }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${
              changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${changeType === "negative" ? "rotate-180" : ""}`} />
              <span className="text-sm font-medium">{change} from last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  // Sample data for charts
  const learningProgressData = [
    { name: "Mon", hours: 2.5, tokens: 120 },
    { name: "Tue", hours: 3.2, tokens: 150 },
    { name: "Wed", hours: 1.8, tokens: 90 },
    { name: "Thu", hours: 4.1, tokens: 200 },
    { name: "Fri", hours: 3.5, tokens: 175 },
    { name: "Sat", hours: 5.2, tokens: 260 },
    { name: "Sun", hours: 2.8, tokens: 140 }
  ];

  const skillDistributionData = [
    { name: "React", value: 35, color: "#3B82F6" },
    { name: "JavaScript", value: 25, color: "#10B981" },
    { name: "Python", value: 20, color: "#F59E0B" },
    { name: "Node.js", value: 15, color: "#EF4444" },
    { name: "Others", value: 5, color: "#8B5CF6" }
  ];

  const monthlyActivityData = [
    { month: "Jan", workshops: 12, internships: 3, badges: 8 },
    { month: "Feb", workshops: 15, internships: 5, badges: 12 },
    { month: "Mar", workshops: 18, internships: 4, badges: 15 },
    { month: "Apr", workshops: 22, internships: 7, badges: 18 },
    { month: "May", workshops: 25, internships: 6, badges: 22 },
    { month: "Jun", workshops: 28, internships: 8, badges: 25 }
  ];

  const performanceData = [
    { subject: "React", score: 85, fullMark: 100 },
    { subject: "JavaScript", score: 92, fullMark: 100 },
    { subject: "Python", score: 78, fullMark: 100 },
    { subject: "Node.js", score: 88, fullMark: 100 }
  ];

  const dashboardCards = [
    {
      title: "Host a Workshop",
      description: "Share your knowledge and earn tokens by teaching others",
      icon: Users,
      gradient: true,
      value: "12",
      change: "+3 this week"
    },
    {
      title: "Apply for Internships",
      description: "Find exciting opportunities to grow your career",
      icon: Briefcase,
      value: "8",
      change: "+2 new"
    },
    {
      title: "View Earned Badges",
      description: "See all the achievements you've unlocked",
      icon: Award,
      value: "25",
      change: "+5 this month"
    },
    {
      title: "Workshop Reviews",
      description: "Check feedback from your recent sessions",
      icon: Star,
      value: "4.8",
      change: "+0.2 rating"
    },
    {
      title: "Token Balance",
      description: "Track your earnings and spending",
      icon: Coins,
      value: "2,450",
      change: "+150 today"
    },
    {
      title: "ML Suggestions",
      description: "Get personalized recommendations for your learning path",
      icon: TrendingUp,
      value: "3",
      change: "Updated"
    },
  ];

  const recentActivities = [
    {
      type: "badge",
      title: "Badge Earned: React Advanced Patterns",
      time: "2 hours ago",
      icon: Award,
      color: "green"
    },
    {
      type: "workshop",
      title: "Hosted Workshop: JavaScript ES6+ Features",
      time: "1 day ago",
      icon: BookOpen,
      color: "blue"
    },
    {
      type: "tokens",
      title: "Tokens Earned: +250 tokens from workshop",
      time: "1 day ago",
      icon: Coins,
      color: "yellow"
    },
    {
      type: "internship",
      title: "Applied to Frontend Developer Internship",
      time: "2 days ago",
      icon: Briefcase,
      color: "purple"
    },
    {
      type: "review",
      title: "Received 5-star review for Python workshop",
      time: "3 days ago",
      icon: Star,
      color: "orange"
    }
  ];

  const getColorForActivity = (color) => {
    const colors = {
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      yellow: "bg-yellow-100 text-yellow-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600"
    };
    return colors[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, track your learning progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Namaste, Rajesh! 👋</h2>
              <p className="text-blue-100 text-lg mb-4">
                Ready to continue your learning journey today?
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>32h learned this month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>85% goal completion</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Learning Hours"
            value="156"
            icon={Clock}
            change="+12h"
            changeType="positive"
          />
          <StatCard
            title="Workshops Hosted"
            value="28"
            icon={Users}
            change="+3"
            changeType="positive"
          />
          <StatCard
            title="Tokens Earned"
            value="12.5K"
            icon={Coins}
            change="+2.1K"
            changeType="positive"
          />
          <StatCard
            title="Average Rating"
            value="4.8"
            icon={Star}
            change="+0.3"
            changeType="positive"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Learning Progress Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Learning Progress</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Tokens</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={learningProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Area type="monotone" dataKey="hours" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                <Area type="monotone" dataKey="tokens" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Skill Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {skillDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Activity Overview</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Legend />
              <Bar dataKey="workshops" fill="#3b82f6" name="Workshops" radius={[4, 4, 0, 0]} />
              <Bar dataKey="internships" fill="#10b981" name="Internships" radius={[4, 4, 0, 0]} />
              <Bar dataKey="badges" fill="#f59e0b" name="Badges" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              gradient={card.gradient}
              value={card.value}
              change={card.change}
              onClick={() => console.log(`Clicked: ${card.title}`)}
            />
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <span>View all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorForActivity(activity.color)}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Metrics</h3>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="space-y-6">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">{item.subject}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-10">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;