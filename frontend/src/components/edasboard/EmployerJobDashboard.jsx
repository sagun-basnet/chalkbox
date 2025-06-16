import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Edit,
  Eye,
  Brain,
  Calendar,
  Users,
  Star,
  Award,
  ExternalLink,
  CheckCircle,
  Filter,
  Search,
  Plus,
  MapPin,
  Clock,
  X,
  User,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  DollarSign,
  FileText,
  Briefcase,
} from "lucide-react";
import { get, post } from "../../utils/api";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmployerJobDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser?.id, "currentUser");

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [proposalsForJob, setProposalsForJob] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const [employerJobs, setEmployerJobs] = useState([]);

  const [candidates, setCandidates] = useState({});
  const [proposals, setProposals] = useState({});

  const getJobs = async () => {
    try {
      setLoading(true);
      const res = await get("/api/jobs");
      console.log("JOBS RESPONSE:", res);

      if (res.status === "success" && Array.isArray(res.data)) {
        // Filter jobs where currentUser is the employer
        if (currentUser && currentUser.id) {
          const filteredJobs = res.data.filter(
            (job) => job.employerId === currentUser.id
          );
          setEmployerJobs(filteredJobs);
          console.log("Employer Jobs:", filteredJobs);
        }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, [currentUser]);

  // Call initMockData when employerJobs changes
  useEffect(() => {
    if (employerJobs.length > 0) {
      initMockData();
    }
  }, [employerJobs]);

  // Temporary function to create mock data for demos
  const initMockData = () => {
    // Mock sample candidate data structure based on API response
    const mockCandidates = {};
    const mockProposals = {};

    // Create sample data for each job if jobs exist
    if (employerJobs && employerJobs.length > 0) {
      employerJobs.forEach((job) => {
        if (job && job.id) {
          mockCandidates[job.id] = [
            {
              id: "sample-id-1",
              name: "Sample Student 1",
              profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
              skills: job.requiredSkills?.slice(0, 3) || [
                "React",
                "JavaScript",
              ],
              badges: [{ name: "Beginner", tier: "BRONZE" }],
              similarity: {
                score: 0.85,
                matchingSkills: job.requiredSkills?.slice(0, 2) || ["React"],
                missingSkills: job.requiredSkills?.slice(2) || ["Node.js"],
              },
            },
            {
              id: "sample-id-2",
              name: "Sample Student 2",
              profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
              skills: job.requiredSkills || ["React", "JavaScript", "Node.js"],
              badges: [{ name: "Expert", tier: "GOLD" }],
              similarity: {
                score: 0.95,
                matchingSkills: job.requiredSkills || [
                  "React",
                  "JavaScript",
                  "Node.js",
                ],
                missingSkills: [],
              },
            },
          ];

          mockProposals[job.id] = [];
        }
      });
    }

    setCandidates(mockCandidates);
    setProposals(mockProposals);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-emerald-500";
      case "CLOSED":
        return "bg-red-500";
      case "DRAFT":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "CLOSED":
        return "Closed";
      case "DRAFT":
        return "Draft";
      default:
        return status;
    }
  };

  const handleCandidateSelect = (candidateId) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleViewProposals = (jobId) => {
    setProposalsForJob(jobId);
    setShowProposalsModal(true);
  };

  const handleViewProfile = (proposal) => {
    setSelectedProfile(proposal);
    setShowProfileModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateNewJob = () => {
    navigate("/employer-dashboard/post-job");
  };

  // Function to fetch suggested freelancers for a job
  const getSuggestedFreelancers = useCallback(async (jobId) => {
    if (!jobId) return;

    try {
      setLoading(true);
      const res = await get(`/api/jobs/${jobId}/suggested-freelancers`);
      console.log("Suggested freelancers response:", res);

      if (res.status === "success" && Array.isArray(res.data)) {
        // Update candidates state with the returned data using functional form
        setCandidates((prevCandidates) => ({
          ...prevCandidates,
          [jobId]: res.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching suggested freelancers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch suggested freelancers when a job is selected
  useEffect(() => {
    if (selectedJob && activeTab === "candidates") {
      getSuggestedFreelancers(selectedJob);
    }
  }, [selectedJob, activeTab, getSuggestedFreelancers]);

  const handleViewCandidateProfile = async (candidateId) => {
    try {
      setProfileLoading(true);
      setShowProfileModal(true);
      const res = await get(`/api/users/${candidateId}`);
      console.log("Candidate profile response:", res);

      if (res.status === "success" && res.data) {
        setSelectedProfile(res.data);
      }
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleHireFreelancer = async (candidateId) => {
    try {
      if (!selectedJob) {
        toast.error("Please select a job first");
        return;
      }

      setLoading(true);
      const res = await post(`/api/jobs/${selectedJob}/invite/${candidateId}`);
      console.log("Invite response:", res);

      if (res.status === "success") {
        toast.success("Invitation sent successfully");
        setShowProfileModal(false);
      } else {
        toast.error(res.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {job.title}
              </h3>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`}
              ></div>
              <span className="text-xs text-gray-500">
                {getStatusText(job.status)}
              </span>
            </div>
            {job.subtitle && (
              <p className="text-gray-700 text-sm font-medium mb-1">
                {job.subtitle}
              </p>
            )}
            <p className="text-gray-600 text-sm mb-3">
              {job.description.length > 120
                ? `${job.description.substring(0, 120)}...`
                : job.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{job.budget}</div>
            <div className="text-xs text-gray-500">Budget</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-xs">
              +{job.requiredSkills.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{job.postedTime || formatDate(job.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>
                {job.proposals || job.applications?.length || 0} proposals
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>
                {job.location} ({job.locationType})
              </span>
            </div>
          </div>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors text-sm">
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => handleViewProposals(job.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors text-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            Proposals
          </button>
          <button
            onClick={() => {
              setSelectedJob(job.id);
              setActiveTab("candidates");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm ml-auto"
          >
            <Brain className="w-3.5 h-3.5" />
            AI Match
          </button>
        </div>
      </div>
    </div>
  );

  const CandidateCard = ({ candidate }) => {
    // Calculate match percentage from similarity score
    const matchPercentage = Math.round(candidate.similarity?.score * 100) || 0;

    // Get badge colors
    const getBadgeColor = (tier) => {
      switch (tier?.toUpperCase()) {
        case "GOLD":
          return "bg-amber-100 text-amber-800 border-amber-200";
        case "SILVER":
          return "bg-gray-100 text-gray-800 border-gray-200";
        case "BRONZE":
          return "bg-orange-100 text-orange-800 border-orange-200";
        default:
          return "bg-blue-100 text-blue-800 border-blue-200";
      }
    };

    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async () => {
      try {
        if (!selectedJob) {
          toast.error("Please select a job first");
          return;
        }

        setIsInviting(true);
        const res = await post(
          `/api/jobs/${selectedJob}/invite/${candidate.id}`
        );
        console.log("Invite response:", res);

        if (res.status === "success") {
          toast.success("Invitation sent successfully");
        } else {
          toast.error(res.message || "Failed to send invitation");
        }
      } catch (error) {
        console.error("Error sending invite:", error);
        toast.error(
          error.response?.data?.message || "Failed to send invitation"
        );
      } finally {
        setIsInviting(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6">
        <div className="flex items-center gap-4">
          {/* Profile Picture & Match Score */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
              {candidate.profilePic ? (
                <img
                  src={candidate.profilePic}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-semibold">
                  {candidate.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
              {matchPercentage}%
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {candidate.name}
              </h3>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id={`select-${candidate.id}`}
                  checked={selectedCandidates.has(candidate.id)}
                  onChange={() => handleCandidateSelect(candidate.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={`select-${candidate.id}`}
                  className="text-xs text-gray-500"
                >
                  Select
                </label>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 my-1.5">
              {candidate.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(
                    badge.tier
                  )}`}
                >
                  {badge.name}
                </span>
              ))}
            </div>

            {/* Skills */}
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Matching Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.similarity?.matchingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-xs"
                  >
                    {skill}
                  </span>
                )) ||
                  candidate.skills?.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* Missing Skills */}
            {candidate.similarity?.missingSkills?.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Missing Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.similarity.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleViewCandidateProfile(candidate.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
          <button
            onClick={handleInvite}
            disabled={isInviting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {isInviting ? (
              <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <MessageCircle className="w-3.5 h-3.5" />
            )}
            {isInviting ? "Sending..." : "Invite"}
          </button>
        </div>
      </div>
    );
  };

  const ProposalCard = ({ proposal }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
            {proposal.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {proposal.name}
            </h3>
            <p className="text-gray-600">{proposal.title}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-500">{proposal.location}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            {proposal.bidAmount}
          </div>
          <div className="text-sm text-gray-500">{proposal.timeframe}</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{proposal.coverLetter}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {proposal.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span>{proposal.rating}</span>
            <span className="text-gray-400">
              ({proposal.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{proposal.completedJobs} jobs completed</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Submitted on {new Date(proposal.submittedDate).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleViewProfile(proposal)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <User className="w-4 h-4" />
          View Profile
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <MessageCircle className="w-4 h-4" />
          Message
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Hire
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Job Manager
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage posts and discover talent
              </p>
            </div>
            <button
              onClick={handleCreateNewJob}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Job
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
              activeTab === "jobs"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Your Jobs ({employerJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
              activeTab === "candidates"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            AI Matches
          </button>
        </div>

        {/* Content */}
        {activeTab === "jobs" ? (
          <div>
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin mr-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600">Loading your jobs...</span>
              </div>
            ) : employerJobs.length > 0 ? (
              <div className="grid gap-6">
                {employerJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start posting jobs to find talented freelancers
                </p>
                <button
                  onClick={handleCreateNewJob}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Job
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Job Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Job
                  </label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="">Choose a job...</option>
                    {employerJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedJob && (
                  <div className="flex gap-2">
                    <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Search className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Matched Candidates */}
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin mr-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600">Finding AI matches...</span>
              </div>
            ) : !selectedJob ? (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No job selected
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a job from the dropdown to see AI-matched candidates
                </p>
              </div>
            ) : candidates[selectedJob]?.length > 0 ? (
              <div className="grid gap-4">
                {candidates[selectedJob].map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-600">
                  We couldn't find any suitable candidates for this job yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proposals Modal */}
      {showProposalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Proposals for{" "}
                  {employerJobs.find((j) => j.id === proposalsForJob)?.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {proposals[proposalsForJob]?.length || 0} proposals received
                </p>
              </div>
              <button
                onClick={() => setShowProposalsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {proposals[proposalsForJob]?.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              )) || (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No proposals found for this job</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {profileLoading ? (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="animate-spin">
                      <User className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                ) : selectedProfile?.profilePic ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={selectedProfile.profilePic}
                      alt={selectedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-semibold">
                      {selectedProfile?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileLoading
                      ? "Loading profile..."
                      : selectedProfile?.name}
                  </h2>
                  <p className="text-gray-600">
                    {profileLoading
                      ? ""
                      : selectedProfile?.role || "Freelancer"}
                  </p>
                  {!profileLoading && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {selectedProfile?.location || "Not specified"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedProfile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {profileLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin mr-2">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600">Loading profile data...</span>
                </div>
              ) : selectedProfile ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Rating & Stats */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            <span className="text-lg font-semibold">
                              {selectedProfile.rating || "New"}
                            </span>
                            <span className="text-gray-500">
                              ({selectedProfile.reviewsReceived?.length || 0}{" "}
                              reviews)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {selectedProfile.completedJobs || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                              Jobs Completed
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Experience</div>
                            <div className="font-medium">
                              {selectedProfile.experience || "Not specified"}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Education</div>
                            <div className="font-medium">
                              {selectedProfile.education || "Not specified"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {selectedProfile.email || "Not available"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {selectedProfile.phone || "Not available"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a
                              href={selectedProfile.website || "#"}
                              className="text-blue-600 hover:underline"
                            >
                              {selectedProfile.website ||
                                "No portfolio available"}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Badges
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.badges?.length > 0 ? (
                            selectedProfile.badges.map((badgeData, index) => (
                              <span
                                key={index}
                                className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-md text-sm"
                              >
                                {badgeData.badge?.name ||
                                  badgeData.name ||
                                  "Badge"}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">No badges yet</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.skills?.length > 0 ? (
                            selectedProfile.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No skills listed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Applications */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Job Applications
                        </h3>
                        <div className="space-y-2">
                          {selectedProfile.applications?.length > 0 ? (
                            selectedProfile.applications.map((app, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="font-medium">
                                  {app.job?.title || "Untitled Job"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {app.status || "PENDING"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500">
                              No applications yet
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reviews */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Reviews
                        </h3>
                        <div className="space-y-3">
                          {selectedProfile.reviewsReceived?.length > 0 ? (
                            selectedProfile.reviewsReceived
                              .slice(0, 2)
                              .map((review, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex">
                                      {[...Array(review.rating || 5)].map(
                                        (_, i) => (
                                          <Star
                                            key={i}
                                            className="w-4 h-4 text-amber-400 fill-current"
                                          />
                                        )
                                      )}
                                    </div>
                                    <span className="text-sm font-medium">
                                      {review.reviewer?.name || "Anonymous"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {review.comment || "No comment provided"}
                                  </p>
                                </div>
                              ))
                          ) : (
                            <div className="text-gray-500">No reviews yet</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProfile.bio || "No bio information available."}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      <ExternalLink className="w-4 h-4" />
                      View Portfolio
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      <MessageCircle className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      onClick={() => handleHireFreelancer(selectedProfile.id)}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Hire Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="text-gray-600">
                    Could not load profile data. Please try again.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobDashboard;
