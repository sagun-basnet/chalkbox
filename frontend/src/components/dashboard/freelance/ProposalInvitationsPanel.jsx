import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Star, Award, Users, Book, MessageCircle, Eye, X, Check, ExternalLink, Hash, Send, UserCheck, Building2 } from 'lucide-react';

const ProposalInvitationsPanel = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    skill: "",
    type: "",
    status: "",
    sort: "recent",
  });

  // Sample data
  const sentProposals = [
    {
      id: 1,
      name: "Dr. Rajesh Hamal",
      email: "rajesh.hamal@tu.edu.np",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Professor of Computer Science at Tribhuvan University. Expert in AI/ML and blockchain technology.",
      skills: ["Machine Learning", "Python", "Blockchain", "Data Science"],
      badges: ["Guru", "Verified Educator"],
      reviewsReceived: 47,
      workshopsHosted: 12,
      workshopsAttended: 5,
      application: {
        title: "AI Research Assistant Position",
        summary:
          "Seeking mentorship in machine learning research for final year project on NLP applications in Nepali language processing.",
      },
      status: "pending",
      submittedOn: "2025-06-10",
    },
    {
      id: 2,
      name: "Sita Sharma",
      email: "sita.sharma@ktm.college.np",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9461e8b?w=150&h=150&fit=crop&crop=face",
      bio: "Full-stack developer and workshop facilitator. Passionate about teaching modern web technologies.",
      skills: ["React", "Node.js", "MongoDB", "UI/UX"],
      badges: ["Shiksharthi", "Workshop Host"],
      reviewsReceived: 32,
      workshopsHosted: 8,
      workshopsAttended: 15,
      application: {
        title: "React Workshop Participation",
        summary:
          "Interested in joining your advanced React workshop to enhance my frontend development skills.",
      },
      status: "accepted",
      submittedOn: "2025-06-08",
      contractHash: "0x742d35Cc6634C0532925a3b8D4051F82",
    },
  ];

  const acceptedByTeachers = [
    {
      id: 1,
      name: "Sita Sharma",
      email: "sita.sharma@ktm.college.np",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9461e8b?w=150&h=150&fit=crop&crop=face",
      bio: "Full-stack developer and workshop facilitator. Passionate about teaching modern web technologies.",
      skills: ["React", "Node.js", "MongoDB", "UI/UX"],
      badges: ["Shiksharthi", "Workshop Host"],
      reviewsReceived: 32,
      workshopsHosted: 8,
      contractHash: "0x742d35Cc6634C0532925a3b8D4051F82",
      acceptedOn: "2025-06-09",
      workshopTitle: "Advanced React Development",
      startDate: "2025-06-20",
    },
  ];

  const companyResponses = [
    {
      id: 1,
      companyName: "Leapfrog Technology",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop",
      verified: true,
      email: "careers@lftechnology.com",
      website: "www.lftechnology.com",
      description:
        "Leading software development company in Nepal, specializing in custom software solutions and digital transformation.",
      jobTitle: "Junior Frontend Developer",
      requiredSkills: ["React", "JavaScript", "CSS", "Git"],
      startDate: "2025-07-01",
      duration: "6 months",
      workMode: "Hybrid",
      rating: 4.8,
      reviews: 156,
      contractHash: "0x8f3e2a1c5b9d4e7f2a6c8b1e3d5f7a9c",
      responseDate: "2025-06-11",
    },
    {
      id: 2,
      companyName: "Fusemachines",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&h=80&fit=crop",
      verified: true,
      email: "internships@fusemachines.com",
      website: "www.fusemachines.com",
      description:
        "AI-first company democratizing artificial intelligence through education, research, and product development.",
      jobTitle: "ML Engineering Intern",
      requiredSkills: [
        "Python",
        "TensorFlow",
        "Machine Learning",
        "Data Analysis",
      ],
      startDate: "2025-06-25",
      duration: "4 months",
      workMode: "Remote",
      rating: 4.6,
      reviews: 89,
      contractHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      responseDate: "2025-06-10",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAcceptOffer = (companyId) => {
    alert(
      `Offer accepted from ${
        companyResponses.find((c) => c.id === companyId)?.companyName
      }! Smart contract will be created.`
    );
  };

  const handleRejectOffer = (companyId) => {
    const feedback = prompt(
      "Optional: Provide feedback for rejecting this offer:"
    );
    alert(`Offer rejected. ${feedback ? `Feedback: ${feedback}` : ""}`);
  };

  const ProposalCard = ({ proposal, type = "sent" }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <img
          src={proposal.avatar}
          alt={proposal.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {proposal.name}
              </h3>
              <p className="text-sm text-gray-600">{proposal.email}</p>
            </div>
            {type === "sent" && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  proposal.status
                )}`}
              >
                {proposal.status.charAt(0).toUpperCase() +
                  proposal.status.slice(1)}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {proposal.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {proposal.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {proposal.badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
              >
                <Award className="w-3 h-3" />
                {badge}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{proposal.reviewsReceived} reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="w-4 h-4" />
              <span>{proposal.workshopsHosted || 0} hosted</span>
            </div>
          </div>

          {proposal.application && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-gray-900 mb-1">
                {proposal.application.title}
              </h4>
              <p className="text-sm text-gray-600">
                {proposal.application.summary}
              </p>
            </div>
          )}

          {type === "accepted" && proposal.contractHash && (
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Smart Contract
                </span>
              </div>
              <p className="text-xs text-gray-600 font-mono">
                {proposal.contractHash}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Accepted on {proposal.acceptedOn}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {type === "sent" && proposal.status === "pending" && (
              <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                Withdraw
              </button>
            )}
            {type === "sent" && proposal.status === "accepted" && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                View Contract
              </button>
            )}
            {type === "accepted" && (
              <>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Join Workshop
                </button>
                <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CompanyCard = ({ company }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={company.logo}
            alt={company.companyName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          {company.verified && (
            <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {company.companyName}
              </h3>
              <p className="text-sm text-gray-600">{company.email}</p>
              <a
                href={`https://${company.website}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-3 h-3 inline mr-1" />
                {company.website}
              </a>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{company.rating}</span>
              <span className="text-gray-500">({company.reviews})</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">{company.description}</p>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              {company.jobTitle}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Starts: {company.startDate}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{company.workMode}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {company.contractHash && (
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Smart Contract Ready
                </span>
              </div>
              <p className="text-xs text-gray-600 font-mono">
                {company.contractHash}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleAcceptOffer(company.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Check className="w-4 h-4 inline mr-2" />
              Accept Offer
            </button>
            <button
              onClick={() => handleRejectOffer(company.id)}
              className="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <X className="w-4 h-4 inline mr-2" />
              Reject Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'sent', label: 'Sent Proposals', count: sentProposals.length, icon: Send },
    { id: 'accepted', label: 'Accepted proposals', count: acceptedByTeachers.length, icon: UserCheck },
    { id: 'companies', label: 'Invitations Projects', count: companyResponses.length, icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Proposal Manager
          </h1>
          <p className="text-gray-600">
            Track and manage your workshop, mentor, and company proposals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, title, or company..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Skills</option>
                <option value="react">React</option>
                <option value="python">Python</option>
                <option value="ml">Machine Learning</option>
              </select>
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Types</option>
                <option value="workshop">Workshop</option>
                <option value="mentorship">Mentorship</option>
                <option value="job">Job</option>
              </select>
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="recent">Most Recent</option>
                <option value="skill-match">Skill Match</option>
                <option value="badge-level">Badge Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Sent Proposals Tab */}
            {activeTab === "sent" && (
              <div className="space-y-6">
                {sentProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    type="sent"
                  />
                ))}
              </div>
            )}

            {/* Accepted by Teachers Tab */}
            {activeTab === "accepted" && (
              <div className="space-y-6">
                {acceptedByTeachers.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    type="accepted"
                  />
                ))}
              </div>
            )}

            {/* Company Responses Tab */}
            {activeTab === "companies" && (
              <div className="space-y-6">
                {companyResponses.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalInvitationsPanel;
