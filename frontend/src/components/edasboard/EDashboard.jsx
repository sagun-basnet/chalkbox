import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Star, 
  FileText, 
  TrendingUp, 
  Eye, 
  Edit3, 
  X, 
  Filter,
  Bell,
  Search,
  MapPin,
  Calendar,
  Award,
  Shield,
  Hash,
  ExternalLink,
  Plus,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const EDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState('all');
  const [animatedValues, setAnimatedValues] = useState({});

  // Mock data
  const summaryStats = {
    totalPostings: 12,
    activeContracts: 4,
    avgRating: 4.7,
    smartContracts: 10,
    changes: {
      totalPostings: 8.2,
      activeContracts: -2.1,
      avgRating: 12.5,
      smartContracts: 15.3
    }
  };

  const postingTrends = [
    { month: 'Jan', jobs: 2 },
    { month: 'Feb', jobs: 3 },
    { month: 'Mar', jobs: 4 },
    { month: 'Apr', jobs: 3 },
    { month: 'May', jobs: 5 },
    { month: 'Jun', jobs: 7 }
  ];

  const applicationStats = {
    applications: 156,
    acceptances: 28,
    pending: 45,
    rejected: 83
  };

  const popularSkills = [
    { skill: 'React.js', count: 24 },
    { skill: 'Node.js', count: 18 },
    { skill: 'Python', count: 15 },
    { skill: 'Docker', count: 12 },
    { skill: 'AWS', count: 9 }
  ];

  const activePostings = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      tags: ['React', 'TypeScript', 'Tailwind'],
      applicants: 12,
      posted: '2024-06-01',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      tags: ['MERN', 'Docker', 'AWS'],
      applicants: 8,
      posted: '2024-05-28',
      status: 'Active'
    },
    {
      id: 3,
      title: 'DevOps Intern',
      tags: ['Docker', 'Kubernetes', 'CI/CD'],
      applicants: 15,
      posted: '2024-05-25',
      status: 'Closed'
    }
  ];

  const suggestedCandidates = [
    {
      id: 1,
      name: 'Priya Sharma',
      skills: ['React', 'Node.js', 'MongoDB'],
      badge: 'Guru',
      tokenScore: 850,
      matchPercent: 92,
      avatar: '👩‍💻',
      recentActivity: 'Completed Docker certification'
    },
    {
      id: 2,
      name: 'Arjun Patel',
      skills: ['Python', 'AWS', 'Docker'],
      badge: 'Acharya',
      tokenScore: 720,
      matchPercent: 88,
      avatar: '👨‍💻',
      recentActivity: 'Won hackathon last week'
    },
    {
      id: 3,
      name: 'Sneha Kumar',
      skills: ['MERN', 'GraphQL', 'TypeScript'],
      badge: 'Guru',
      tokenScore: 910,
      matchPercent: 95,
      avatar: '👩‍🎓',
      recentActivity: 'Published open source project'
    }
  ];

  const contracts = [
    {
      id: 1,
      jobTitle: 'React Developer Intern',
      studentName: 'Rahul Gupta',
      status: 'Signed',
      hash: '0x7b2a...3f8c',
      date: '2024-06-05'
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      studentName: 'Anita Singh',
      status: 'Pending',
      hash: 'Generating...',
      date: '2024-06-08'
    }
  ];

  const notifications = [
    { id: 1, type: 'application', message: '3 new applications for Frontend Intern role', time: '2 hours ago' },
    { id: 2, type: 'contract', message: 'Smart contract signed with Rahul Gupta', time: '1 day ago' },
    { id: 3, type: 'suggestion', message: '2 new MERN developers match your criteria', time: '2 days ago' }
  ];

  // Animation effect for numbers
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        totalPostings: summaryStats.totalPostings,
        activeContracts: summaryStats.activeContracts,
        avgRating: summaryStats.avgRating,
        smartContracts: summaryStats.smartContracts
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced SummaryCard Component
  const SummaryCard = ({ title, value, icon: Icon, subtitle, change }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setDisplayValue(typeof value === 'string' ? value : value);
      }, 200);
      return () => clearTimeout(timer);
    }, [value]);

    const isPositive = change > 0;
    
    return (
      <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-900 transition-all duration-500">
                {typeof displayValue === 'string' ? displayValue : displayValue}
              </p>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
          
          {/* Change indicator */}
          {change && (
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced BarChart Component
  const BarChart = ({ data, title, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(item => item.jobs || item.count));
    
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = ((item.jobs || item.count) / maxValue) * 100;
            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.month || item.skill}</span>
                  <span className="text-sm font-bold text-gray-900">{item.jobs || item.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                    style={{ 
                      width: `${percentage}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Enhanced ApplicationsPieChart Component
  const ApplicationsPieChart = () => {
    const total = applicationStats.applications;
    const acceptedPercentage = (applicationStats.acceptances / total) * 100;
    const pendingPercentage = (applicationStats.pending / total) * 100;
    const rejectedPercentage = (applicationStats.rejected / total) * 100;

    const [animatedPercentages, setAnimatedPercentages] = useState({
      accepted: 0,
      pending: 0,
      rejected: 0
    });

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedPercentages({
          accepted: acceptedPercentage,
          pending: pendingPercentage,
          rejected: rejectedPercentage
        });
      }, 300);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Applications Overview</h3>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <PieChart className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        {/* Donut Chart Visualization */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            
            {/* Accepted segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient-green)"
              strokeWidth="8"
              strokeDasharray={`${animatedPercentages.accepted * 2.51} 251.2`}
              strokeDashoffset="0"
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            
            {/* Pending segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient-yellow)"
              strokeWidth="8"
              strokeDasharray={`${animatedPercentages.pending * 2.51} 251.2`}
              strokeDashoffset={-animatedPercentages.accepted * 2.51}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            
            {/* Rejected segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient-red)"
              strokeWidth="8"
              strokeDasharray={`${animatedPercentages.rejected * 2.51} 251.2`}
              strokeDashoffset={-(animatedPercentages.accepted + animatedPercentages.pending) * 2.51}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradient-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Total Apps</div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <span className="text-lg font-bold text-white">{applicationStats.acceptances}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Accepted</p>
            <p className="text-xs text-green-600 font-semibold">{acceptedPercentage.toFixed(1)}%</p>
          </div>
          
          <div className="text-center group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <span className="text-lg font-bold text-white">{applicationStats.pending}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Pending</p>
            <p className="text-xs text-yellow-600 font-semibold">{pendingPercentage.toFixed(1)}%</p>
          </div>
          
          <div className="text-center group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <span className="text-lg font-bold text-white">{applicationStats.rejected}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Rejected</p>
            <p className="text-xs text-red-600 font-semibold">{rejectedPercentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'postings', label: 'Job Postings', icon: Briefcase },
              { id: 'candidates', label: 'Talent Discovery', icon: Users },
              { id: 'contracts', label: 'Smart Contracts', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Total Postings"
                value={summaryStats.totalPostings}
                icon={Briefcase}
                change={summaryStats.changes.totalPostings}
              />
              <SummaryCard
                title="Active Contracts"
                value={summaryStats.activeContracts}
                icon={FileText}
                change={summaryStats.changes.activeContracts}
              />
              <SummaryCard
                title="Avg Student Rating"
                value={`${summaryStats.avgRating}⭐`}
                icon={Star}
                change={summaryStats.changes.avgRating}
              />
              <SummaryCard
                title="Smart Contracts"
                value={summaryStats.smartContracts}
                icon={Hash}
                subtitle="Successfully signed"
                change={summaryStats.changes.smartContracts}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BarChart data={postingTrends} title="Posting Trends" color="blue" />
              <ApplicationsPieChart />
              <BarChart data={popularSkills} title="Popular Skills" color="purple" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Notifications</h3>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employer Trust Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Trust Score</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Verification Status</span>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-green-600">Verified Partner</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Student Reviews</span>
                    <span className="text-sm font-bold text-gray-900">4.8⭐ (24 reviews)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Trust Badge</span>
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-bold text-purple-600">Elite Partner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'postings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Job Postings</h2>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Posting</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Skills</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Applicants</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Posted</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {activePostings.map((posting) => (
                      <tr key={posting.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{posting.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {posting.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{posting.applicants}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{posting.posted}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            posting.status === 'Active' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                          }`}>
                            {posting.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-150">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 transition-colors duration-150">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors duration-150">
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Talent Discovery</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedSkill} 
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Skills</option>
                  <option value="react">React</option>
                  <option value="node">Node.js</option>
                  <option value="python">Python</option>
                </select>
                <select 
                  value={selectedBadge} 
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Badges</option>
                  <option value="guru">Guru</option>
                  <option value="acharya">Acharya</option>
                </select>
              </div>
            </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">AI</span>
                              </div>
                              <span className="font-bold text-blue-900 text-lg">Smart Recommendations</span>
                            </div>
                        </div>
                      </div>
                    )}
            
                    {/* Add closing tag for the main wrapper div */}
                  </main>
                </div>
              );
            };
            
            export default EDashboard;

