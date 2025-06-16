'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Users,
  Zap,
  BookOpen,
  Star,
  Info,
  X,
  Clock,
  User,
  Award,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import axios from 'axios';

const JoinWorkshops = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('upcoming');

  // API state management
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [recommendedWorkshops, setRecommendedWorkshops] = useState([]);
  const [joinedWorkshops, setJoinedWorkshops] = useState([]);

  // Loading states
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [joinedLoading, setJoinedLoading] = useState(false);

  // Error states
  const [upcomingError, setUpcomingError] = useState(null);
  const [recommendedError, setRecommendedError] = useState(null);
  const [joinedError, setJoinedError] = useState(null);

  // Base URL - you can replace this with your actual base URL
  const BASE_URL = 'http://localhost:3000/api';

  // Fetch upcoming workshops (mock data for now, replace with your API)
  const fetchUpcomingWorkshops = async () => {
    try {
      setUpcomingLoading(true);
      setUpcomingError(null);

      // Mock data - replace with your actual API call
      const mockData = [
        {
          id: 1,
          title: 'Full Stack Web Development',
          skills: ['React', 'Node.js', 'MongoDB', 'Express'],
          host: { name: 'Ramesh Thapa', badges: [{ badge: { name: 'GURU' } }] },
          startDate: '2025-06-15T14:00:00Z',
          endDate: '2025-06-15T17:00:00Z',
          totalSeats: 30,
          attendees: Array(23).fill({}),
          zoomStatus: 'Link will be active 30 minutes before event',
          description:
            'Master the complete MERN stack development process. Learn to build modern, scalable web applications from scratch using MongoDB, Express.js, React, and Node.js.',
          outcomes: [
            'Build full-stack applications',
            'Master React hooks and state management',
            'Implement RESTful APIs',
            'Deploy applications to cloud',
          ],
          hostBio:
            'Senior Software Engineer at Leapfrog Technology with 8+ years of experience in full-stack development.',
          rules: [
            'Laptop with stable internet required',
            'Basic JavaScript knowledge preferred',
            'Be punctual and interactive',
          ],
        },
        {
          id: 2,
          title: 'UI/UX Design Fundamentals',
          skills: ['Figma', 'Design Thinking', 'Prototyping'],
          host: {
            name: 'Sita Sharma',
            badges: [{ badge: { name: 'ACHARYA' } }],
          },
          startDate: '2025-06-18T10:00:00Z',
          endDate: '2025-06-18T13:00:00Z',
          totalSeats: 25,
          attendees: Array(18).fill({}),
          zoomStatus: 'Link will be active before event',
          description:
            'Learn the fundamentals of UI/UX design, from user research to creating beautiful, functional interfaces that users love.',
          outcomes: [
            'Master design principles',
            'Create user personas',
            'Build wireframes and prototypes',
            'Conduct usability testing',
          ],
          hostBio:
            'Lead Designer at F1Soft with expertise in creating user-centered digital experiences for fintech applications.',
          rules: [
            'Figma account required',
            'Creative mindset welcome',
            'Participate in design exercises',
          ],
        },
      ];

      setUpcomingWorkshops(mockData);
    } catch (error) {
      console.error('Error fetching upcoming workshops:', error);
      setUpcomingError('Failed to load upcoming workshops');
    } finally {
      setUpcomingLoading(false);
    }
  };

  // Fetch recommended workshops from API
  const fetchRecommendedWorkshops = async () => {
    try {
      console.log('🎯 Fetching recommended workshops...');
      setRecommendedLoading(true);
      setRecommendedError(null);

      const response = await axios.get(
        `${BASE_URL}/workshops/suggestions?limit=5`,
        {
          withCredentials: true,
        }
      );

      console.log('✅ Recommended workshops fetched:', response.data);

      if (response.data.status === 'success') {
        setRecommendedWorkshops(response.data.data || []);
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error(
        '❌ Error fetching recommended workshops:',
        error?.response?.data || error.message
      );
      setRecommendedError('Failed to load recommended workshops');
    } finally {
      setRecommendedLoading(false);
    }
  };

  // Fetch joined workshops from API
  const fetchJoinedWorkshops = async () => {
    try {
      console.log('📚 Fetching joined workshops...');
      setJoinedLoading(true);
      setJoinedError(null);

      const response = await axios.get(`${BASE_URL}/workshops/my-joined`, {
        withCredentials: true,
      });

      console.log('✅ Joined workshops fetched:', response.data);
      setJoinedWorkshops(response.data || []);
    } catch (error) {
      console.error(
        '❌ Error fetching joined workshops:',
        error?.response?.data || error.message
      );
      setJoinedError('Failed to load joined workshops');
    } finally {
      setJoinedLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUpcomingWorkshops();
    fetchRecommendedWorkshops();
    fetchJoinedWorkshops();
  }, []);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'GURU':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ACHARYA':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'EXPERT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSkillColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    return colors[index % colors.length];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  const WorkshopCard = ({ workshop, isRecommended = false }) => (
    <div className="card bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {workshop.title}
        </h3>
        {isRecommended && workshop.similarity && (
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            🎓 {workshop.similarity.matchPercentage}% Match
          </span>
        )}
      </div>

      {isRecommended && workshop.similarity && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <ChevronRight size={14} />
            <span className="font-medium">
              {workshop.similarity.matchPercentage}% skill match based on your
              profile
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {workshop.skillsTaught?.map((skill, index) => (
          <span
            key={skill}
            className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(
              index
            )}`}
          >
            {skill}
          </span>
        )) ||
          workshop.skills?.map((skill, index) => (
            <span
              key={skill}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(
                index
              )}`}
            >
              {skill}
            </span>
          ))}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {workshop.host?.name || workshop.host}
          </span>
          {workshop.host?.badges && workshop.host.badges.length > 0 && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
                workshop.host.badges[0].badge.name
              )}`}
            >
              {workshop.host.badges[0].badge.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {formatDate(workshop.startDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {workshop.endDate
              ? formatTime(workshop.startDate, workshop.endDate)
              : workshop.time}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {workshop.attendees?.length || workshop.registered || 0}/
            {workshop.totalSeats} registered
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
            <div
              className="bg-blue-500 rounded-full h-2"
              style={{
                width: `${
                  ((workshop.attendees?.length || workshop.registered || 0) /
                    workshop.totalSeats) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {workshop.zoomStatus && (
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">{workshop.zoomStatus}</span>
          </div>
        )}

        {isRecommended && workshop.similarity && (
          <div className="flex items-start gap-2 group cursor-pointer">
            <Info size={16} className="text-blue-500 mt-0.5" />
            <span className="text-sm text-blue-600 group-hover:text-blue-800">
              Recommended based on your learning history and interests
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-colors duration-200">
          📌 Register
        </button>
        <button
          onClick={() => setSelectedWorkshop(workshop)}
          className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          🔍 Details
        </button>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-18 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
        <div className="w-20 h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  const ErrorCard = ({ error, onRetry }) => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-red-200 text-center">
      <div className="text-red-500 mb-3">{error}</div>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );

  const Modal = ({ workshop, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {workshop.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {workshop.host?.name || workshop.host}
                </span>
                {workshop.host?.badges && workshop.host.badges.length > 0 && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
                      workshop.host.badges[0].badge.name
                    )}`}
                  >
                    {workshop.host.badges[0].badge.name}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Workshop Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {workshop.description}
            </p>
          </div>

          {workshop.outcomes && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award size={20} className="text-green-600" />
                Learning Outcomes
              </h3>
              <ul className="space-y-2">
                {workshop.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {workshop.hostBio && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User size={20} className="text-purple-600" />
                About the Host
              </h3>
              <p className="text-gray-700">{workshop.hostBio}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">📅 Date & Time</h4>
              <p className="text-gray-700">{formatDate(workshop.startDate)}</p>
              <p className="text-gray-700">
                {workshop.endDate
                  ? formatTime(workshop.startDate, workshop.endDate)
                  : workshop.time}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">👥 Capacity</h4>
              <p className="text-gray-700">
                {workshop.attendees?.length || workshop.registered || 0}/
                {workshop.totalSeats} registered
              </p>
              <p className="text-sm text-gray-500">
                {workshop.totalSeats -
                  (workshop.attendees?.length || workshop.registered || 0)}{' '}
                seats remaining
              </p>
            </div>
          </div>

          {workshop.rules && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                📋 Workshop Guidelines
              </h3>
              <ul className="space-y-2">
                {workshop.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-6">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium text-lg transition-colors duration-200">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Join Workshops
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and join workshops tailored for Nepali students. Learn
              new skills, connect with experts, and advance your career.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search workshops, skills, or hosts..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Workshops</option>
                <option value="tech">Technology</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-3 py-4 px-6 border-b-2 font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  activeTab === 'upcoming' ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <Calendar
                  size={20}
                  className={
                    activeTab === 'upcoming' ? 'text-blue-600' : 'text-gray-500'
                  }
                />
              </div>
              <span className="text-lg cursor-pointer">
                Future Hosting Workshops
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {upcomingWorkshops.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('recommended')}
              className={`flex items-center gap-3 py-4 px-6 border-b-2 font-medium transition-colors ${
                activeTab === 'recommended'
                  ? 'border-purple-600 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  activeTab === 'recommended'
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                <Star
                  size={20}
                  className={
                    activeTab === 'recommended'
                      ? 'text-purple-600'
                      : 'text-gray-500'
                  }
                />
              </div>
              <span className="text-lg cursor-pointer">
                Recommended For You
              </span>
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                🤖 AI
                {recommendedLoading && (
                  <Loader2 size={12} className="animate-spin" />
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('joined')}
              className={`flex items-center gap-3 py-4 px-6 border-b-2 font-medium transition-colors ${
                activeTab === 'joined'
                  ? 'border-green-600 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  activeTab === 'joined' ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <Users
                  size={20}
                  className={
                    activeTab === 'joined' ? 'text-green-600' : 'text-gray-500'
                  }
                />
              </div>
              <span className="text-lg cursor-pointer">
                My Joined Workshops
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {joinedWorkshops.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'upcoming' && (
          <section>
            {upcomingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : upcomingError ? (
              <ErrorCard
                error={upcomingError}
                onRetry={fetchUpcomingWorkshops}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingWorkshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'recommended' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Personalized Recommendations
              </h2>
              <button
                onClick={fetchRecommendedWorkshops}
                disabled={recommendedLoading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {recommendedLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Refresh
              </button>
            </div>

            {recommendedLoading && recommendedWorkshops.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : recommendedError ? (
              <ErrorCard
                error={recommendedError}
                onRetry={fetchRecommendedWorkshops}
              />
            ) : recommendedWorkshops.length === 0 ? (
              <div className="text-center py-12">
                <Star size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No recommendations available
                </h3>
                <p className="text-gray-600">
                  Complete your profile to get personalized workshop
                  recommendations
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedWorkshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    isRecommended={true}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'joined' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                My Joined Workshops
              </h2>
              <button
                onClick={fetchJoinedWorkshops}
                disabled={joinedLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {joinedLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Refresh
              </button>
            </div>

            {joinedLoading && joinedWorkshops.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : joinedError ? (
              <ErrorCard error={joinedError} onRetry={fetchJoinedWorkshops} />
            ) : joinedWorkshops.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No joined workshops yet
                </h3>
                <p className="text-gray-600">
                  Start joining workshops to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedWorkshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modal */}
      {selectedWorkshop && (
        <Modal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </div>
  );
};

export default JoinWorkshops;
