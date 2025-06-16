import React, { useState } from "react";
import {
  User,
  Clock,
  Calendar,
  Award,
  Star,
  Check,
  X,
  Eye,
  Filter,
  TrendingUp,
} from "lucide-react";

const WorkshopRequests = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("request_time");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);

  // Sample data
  const workshop = {
    title: "Intro to Docker for MERN Developers",
    date: "June 15, 4:00 PM – 5:30 PM",
    host: "Alex Johnson",
    hostBadge: "Guru",
    totalRequests: 12,
    approved: 5,
  };

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      badge: "Shiksharthi",
      skills: ["React", "Node.js", "MongoDB"],
      tokens: 1250,
      workshopsAttended: 8,
      rating: 4.8,
      reviewCount: 12,
      message:
        "I'd love to attend and learn about Docker basics! I'm currently working on a MERN project and this would be perfect.",
      requestTime: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      name: "Rahul Patel",
      badge: "Utsaahi Intern",
      skills: ["JavaScript", "Express", "Docker"],
      tokens: 890,
      workshopsAttended: 5,
      rating: 4.6,
      reviewCount: 8,
      message: "Excited to learn more about Docker deployment strategies!",
      requestTime: "3 hours ago",
      status: "pending",
    },
    {
      id: 3,
      name: "Sarah Chen",
      badge: "Tech Explorer",
      skills: ["React", "Python", "AWS"],
      tokens: 2100,
      workshopsAttended: 15,
      rating: 4.9,
      reviewCount: 20,
      message: "",
      requestTime: "4 hours ago",
      status: "accepted",
    },
    {
      id: 4,
      name: "Michael Brown",
      badge: "Code Ninja",
      skills: ["Vue.js", "Node.js", "PostgreSQL"],
      tokens: 756,
      workshopsAttended: 3,
      rating: 4.2,
      reviewCount: 5,
      message:
        "New to Docker but eager to learn. I've been following your other workshops!",
      requestTime: "5 hours ago",
      status: "pending",
    },
    {
      id: 5,
      name: "Lisa Wang",
      badge: "Full Stack Pro",
      skills: ["React", "Node.js", "Docker", "Kubernetes"],
      tokens: 3200,
      workshopsAttended: 25,
      rating: 4.9,
      reviewCount: 35,
      message:
        "Would love to share insights and learn advanced Docker techniques.",
      requestTime: "6 hours ago",
      status: "rejected",
    },
  ]);

  const handleAccept = (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "accepted" } : req))
    );
  };

  const handleReject = (id, reason = "") => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: "rejected", rejectReason: reason }
          : req
      )
    );
    setShowRejectModal(null);
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "All") return true;
    return req.status === activeTab.toLowerCase();
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "skill_match":
        return b.skills.length - a.skills.length;
      case "token_level":
        return b.tokens - a.tokens;
      case "request_time":
      default:
        return a.id - b.id;
    }
  });

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  const getBadgeColor = (badge) => {
    const colors = {
      Guru: "bg-purple-100 text-purple-800",
      Shiksharthi: "bg-blue-100 text-blue-800",
      "Utsaahi Intern": "bg-green-100 text-green-800",
      "Tech Explorer": "bg-orange-100 text-orange-800",
      "Code Ninja": "bg-red-100 text-red-800",
      "Full Stack Pro": "bg-indigo-100 text-indigo-800",
    };
    return colors[badge] || "bg-gray-100 text-gray-800";
  };

  const topLearners = requests
    .filter((r) => r.status === "pending")
    .sort(
      (a, b) => b.rating * b.workshopsAttended - a.rating * a.workshopsAttended
    )
    .slice(0, 3);

  return (
    <div
      className="min-h-screen bg-white text-gray-800"
      style={{ color: "#2A2A2A" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            🧑‍🎓 Join Requests for Your Workshop
          </h1>
          <p className="text-gray-600">
            Review and accept students who requested to join your hosted
            workshop.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Workshop Overview Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{workshop.title}</h2>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{workshop.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Host: {workshop.host}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                    workshop.hostBadge
                  )}`}
                >
                  {workshop.hostBadge}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: "#2A66DE" }}>
                {workshop.totalRequests} Join Requests
              </div>
              <div className="text-gray-600">{workshop.approved} Approved</div>
            </div>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab ? "#2A66DE" : "transparent",
                }}
              >
                {tab} (
                {tab === "All"
                  ? statusCounts.all
                  : statusCounts[tab.toLowerCase()]}
                )
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="request_time">Sort by Request Time</option>
              <option value="skill_match">Sort by Skill Match</option>
              <option value="token_level">Sort by Token Level</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4 mb-8">
          {sortedRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {request.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                            request.badge
                          )}`}
                        >
                          {request.badge}
                        </span>
                      </div>
                      {request.rating && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span>{request.rating}</span>
                          <span>({request.reviewCount} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {request.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">
                        Tokens Earned
                      </h4>
                      <p className="text-sm text-gray-600">
                        {request.tokens.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">
                        Workshops Attended
                      </h4>
                      <p className="text-sm text-gray-600">
                        {request.workshopsAttended}
                      </p>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">
                        Message
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {request.message}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Requested {request.requestTime}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        <Check size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => setShowRejectModal(request.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "accepted" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm">
                      <Check size={16} />
                      Accepted
                    </div>
                  )}
                  {request.status === "rejected" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-md text-sm">
                      <X size={16} />
                      Rejected
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedProfile(request)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Eye size={16} />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Footer */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} style={{ color: "#2A66DE" }} />
            <h3 className="text-lg font-semibold">
              Analytics & Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#2A66DE" }}>
                {statusCounts.all}
              </div>
              <div className="text-gray-600">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.accepted}
              </div>
              <div className="text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {statusCounts.rejected}
              </div>
              <div className="text-gray-600">Rejected</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              🤖 AI Suggestions: Top 3 learners based on past reviews
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topLearners.map((learner, index) => (
                <div key={learner.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{learner.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Star
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span>{learner.rating} rating</span>
                    </div>
                    <div>{learner.workshopsAttended} workshops attended</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Full Profile</h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-semibold">
                    {selectedProfile.name}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                      selectedProfile.badge
                    )}`}
                  >
                    {selectedProfile.badge}
                  </span>
                </div>
                {selectedProfile.rating && (
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>{selectedProfile.rating}</span>
                    <span className="text-gray-600">
                      ({selectedProfile.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Statistics</h5>
                <div className="space-y-1 text-sm">
                  <div>Tokens: {selectedProfile.tokens.toLocaleString()}</div>
                  <div>Workshops: {selectedProfile.workshopsAttended}</div>
                </div>
              </div>
            </div>

            {selectedProfile.message && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Message</h5>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedProfile.message}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Reject Request</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this join request? You can
              optionally provide a reason.
            </p>
            <textarea
              placeholder="Optional reason for rejection..."
              className="w-full border border-gray-300 rounded-md p-3 mb-4 resize-none"
              rows="3"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopRequests;
