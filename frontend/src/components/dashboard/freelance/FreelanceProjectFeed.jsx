import React, { useState, useMemo } from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  User,
  Star,
  Bookmark,
  BookmarkCheck,
  Send,
  Search,
  Filter,
  ChevronDown,
  Badge,
  Target,
  TrendingUp,
  Calendar,
  X,
  Info,
} from "lucide-react";

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    employer: {
      name: "TechCorp Solutions",
      username: "@techcorp",
      avatar: "TC",
      verified: true,
      rating: 4.8,
    },
    postedTime: "3 hours ago",
    title: "E-commerce Website Development",
    description:
      "Looking for a skilled developer to build a modern e-commerce platform with React and Node.js. The project involves creating a responsive frontend, secure payment integration, and admin dashboard. Experience with Stripe and MongoDB is preferred.",
    skills: ["React", "Node.js", "MongoDB", "Stripe", "CSS"],
    duration: "3 weeks",
    budget: "NPR 85,000",
    location: "Remote",
    proposals: 12,
    aiMatch: 92,
  },
  {
    id: 2,
    employer: {
      name: "Sarah Johnson",
      username: "@sarahj_design",
      avatar: "SJ",
      verified: true,
      rating: 4.9,
    },
    postedTime: "1 day ago",
    title: "Mobile App UI/UX Design",
    description:
      "Need a creative designer to create modern, intuitive UI/UX for a fitness tracking mobile app. Looking for someone with experience in Figma and understanding of mobile design principles.",
    skills: ["UI/UX", "Figma", "Mobile Design", "Prototyping"],
    duration: "2 weeks",
    budget: "NPR 45,000",
    location: "Remote",
    proposals: 8,
    aiMatch: 76,
  },
  {
    id: 3,
    employer: {
      name: "Digital Marketing Pro",
      username: "@digitalmarkpro",
      avatar: "DM",
      verified: false,
      rating: 4.2,
    },
    postedTime: "2 days ago",
    title: "Social Media Content Creation",
    description:
      "Seeking a creative content creator to develop engaging social media posts, stories, and reels for multiple platforms. Must have experience with Adobe Creative Suite and understanding of current social media trends.",
    skills: ["Content Creation", "Adobe Photoshop", "Social Media"],
    duration: "1 month",
    budget: "Negotiable",
    location: "Hybrid",
    proposals: 15,
    aiMatch: 84,
  },
  {
    id: 4,
    employer: {
      name: "StartupHub Nepal",
      username: "@startuphub_np",
      avatar: "SH",
      verified: true,
      rating: 4.6,
    },
    postedTime: "5 hours ago",
    title: "Python Data Analysis Project",
    description:
      "Looking for a data analyst to work on customer behavior analysis using Python, pandas, and visualization libraries. Experience with machine learning is a plus.",
    skills: ["Python", "Pandas", "Data Analysis", "Matplotlib", "Seaborn"],
    duration: "1 week",
    budget: "NPR 25,000",
    location: "Remote",
    proposals: 6,
    aiMatch: 88,
  },
];

// Mock student profile for AI matching
const studentProfile = {
  skills: ["React", "JavaScript", "CSS", "Node.js", "Python", "MongoDB"],
  experience: "Intermediate",
  interests: ["Web Development", "Backend Development"],
  completedProjects: 8,
  rating: 4.5,
};

const FreelanceProjectFeed = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [bookmarkedProjects, setBookmarkedProjects] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    introduction:
      "Hi! I'm a skilled developer with experience in modern web technologies. I have successfully completed 8+ projects with a 4.5-star rating...",
    message: "",
    deliveryTime: "",
    proposedBudget: "",
  });

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = mockProjects;

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.aiMatch - a.aiMatch;
        case "budget":
          const budgetA =
            a.budget === "Negotiable"
              ? 0
              : parseInt(a.budget.replace(/[^\d]/g, ""));
          const budgetB =
            b.budget === "Negotiable"
              ? 0
              : parseInt(b.budget.replace(/[^\d]/g, ""));
          return budgetB - budgetA;
        default:
          return 0; // Keep original order for 'latest'
      }
    });

    return filtered;
  }, [searchQuery, sortBy]);

  const aiRecommendedProjects = useMemo(() => {
    return filteredProjects
      .filter((project) => project.aiMatch >= 75)
      .sort((a, b) => b.aiMatch - a.aiMatch);
  }, [filteredProjects]);

  const toggleBookmark = (projectId) => {
    const newBookmarks = new Set(bookmarkedProjects);
    if (newBookmarks.has(projectId)) {
      newBookmarks.delete(projectId);
    } else {
      newBookmarks.add(projectId);
    }
    setBookmarkedProjects(newBookmarks);
  };

  const toggleDescription = (projectId) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const handleSubmitProposal = () => {
    // Handle proposal submission logic here
    console.log("Submitting proposal:", proposalForm);
    setShowProposalModal(false);
    setProposalForm({
      introduction:
        "Hi! I'm a skilled developer with experience in modern web technologies. I have successfully completed 8+ projects with a 4.5-star rating...",
      message: "",
      deliveryTime: "",
      proposedBudget: "",
    });
  };

  const getMatchingSkills = (projectSkills) => {
    return projectSkills.filter((skill) =>
      studentProfile.skills.some(
        (studentSkill) => studentSkill.toLowerCase() === skill.toLowerCase()
      )
    );
  };

  const getMissingSkills = (projectSkills) => {
    return projectSkills.filter(
      (skill) =>
        !studentProfile.skills.some(
          (studentSkill) => studentSkill.toLowerCase() === skill.toLowerCase()
        )
    );
  };

  const ProjectCard = ({ project, showAIMatch = false }) => {
    const isExpanded = expandedDescriptions.has(project.id);
    const isBookmarked = bookmarkedProjects.has(project.id);
    const matchingSkills = getMatchingSkills(project.skills);
    const missingSkills = getMissingSkills(project.skills);

    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {project.employer.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">
                  {project.employer.name}
                </h3>
                {project.employer.verified && (
                  <Badge className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {project.employer.username}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">
                  {project.employer.rating}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {project.postedTime}
            </span>
            <button
              onClick={() => toggleBookmark(project.id)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-blue-500" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* AI Match Score */}
        {showAIMatch && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  {project.aiMatch}% Match
                </span>
              </div>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <p className="font-semibold mb-2">Why this is recommended:</p>
                  <p className="mb-2">
                    <span className="text-green-300">Matching skills:</span>{" "}
                    {matchingSkills.join(", ")}
                  </p>
                  {missingSkills.length > 0 && (
                    <p>
                      <span className="text-yellow-300">
                        Learn these for better match:
                      </span>{" "}
                      {missingSkills.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {project.title}
        </h2>

        {/* Project Description */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {isExpanded
              ? project.description
              : `${project.description.substring(0, 150)}...`}
          </p>
          <button
            onClick={() => toggleDescription(project.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => {
              const isMatching = showAIMatch && matchingSkills.includes(skill);
              return (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isMatching
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Project Details */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="font-semibold">{project.budget}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{project.proposals} proposals</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setSelectedProject(project);
            setShowProposalModal(true);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>Submit Proposal</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Freelance Projects
          </h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all flex items-center space-x-2 ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>📄</span>
              <span>All Projects</span>
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all flex items-center space-x-2 ${
                activeTab === "ai"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>🤖</span>
              <span>AI Recommendations</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                {aiRecommendedProjects.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by title or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter and Sort */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="latest">Latest</option>
              <option value="match">Best Match</option>
              <option value="budget">Highest Budget</option>
            </select>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(activeTab === "all" ? filteredProjects : aiRecommendedProjects).map(
            (project) => (
              <ProjectCard
                key={project.id}
                project={project}
                showAIMatch={activeTab === "ai"}
              />
            )
          )}
        </div>

        {/* Empty State */}
        {(activeTab === "all" ? filteredProjects : aiRecommendedProjects)
          .length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === "ai" ? "🤖" : "📋"}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === "ai"
                ? "No AI Recommendations"
                : "No Projects Found"}
            </h3>
            <p className="text-gray-600">
              {activeTab === "ai"
                ? "Update your profile skills to get better AI recommendations"
                : "Try adjusting your search or filters to find more projects"}
            </p>
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      {showProposalModal && selectedProject && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Submit Proposal
                </h2>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                for "{selectedProject.title}"
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Introduction
                </label>
                <textarea
                  value={proposalForm.introduction}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      introduction: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell the client about yourself..."
                />
              </div>

              {/* Proposal Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proposal Message
                </label>
                <textarea
                  value={proposalForm.message}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      message: e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe how you'll approach this project..."
                  required
                />
              </div>

              {/* Delivery Time and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <select
                    value={proposalForm.deliveryTime}
                    onChange={(e) =>
                      setProposalForm({
                        ...proposalForm,
                        deliveryTime: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="1 day">1 day</option>
                    <option value="3 days">3 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Proposed Budget (NPR)
                  </label>
                  <input
                    type="number"
                    value={proposalForm.proposedBudget}
                    onChange={(e) =>
                      setProposalForm({
                        ...proposalForm,
                        proposedBudget: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your rate"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitProposal}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Proposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelanceProjectFeed;
