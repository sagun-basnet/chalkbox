import React, { useState, useMemo } from "react";
import {
  Search,
  Github,
  Star,
  GitBranch,
  MessageCircle,
  Clock,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";

const OpenSourceContributions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data for contributions
  const contributions = [
    {
      id: 1,
      project: {
        title: "React UI Components Library",
        description:
          "A comprehensive set of accessible, customizable React components for modern web applications.",
        url: "https://github.com/example/react-ui-lib",
      },
      student: {
        name: "Arjun Patel",
        avatar: "AP",
        profileUrl: "/profile/arjun-patel",
        badge: {
          name: "Guru",
          level: "guru",
          tooltip: "Guru – 10+ 5-star reviews",
        },
      },
      skills: ["React", "TypeScript", "CSS", "Storybook"],
      matchedSkills: ["React", "TypeScript"],
      contributionType: { name: "Feature Added", type: "feature" },
      metrics: {
        prsmerged: 5,
        comments: 23,
        timeToMerge: "2 days",
      },
      timestamp: "2024-06-10",
    },
    {
      id: 2,
      project: {
        title: "Python Data Analysis Toolkit",
        description:
          "Advanced statistical analysis and visualization tools for data scientists and researchers.",
        url: "https://github.com/example/python-data-toolkit",
      },
      student: {
        name: "Priya Sharma",
        avatar: "PS",
        profileUrl: "/profile/priya-sharma",
        badge: {
          name: "Acharya",
          level: "acharya",
          tooltip: "Acharya – Expert level contributor",
        },
      },
      skills: ["Python", "NumPy", "Pandas", "Matplotlib"],
      matchedSkills: ["Python", "NumPy"],
      contributionType: { name: "Bug Fix", type: "bugfix" },
      metrics: {
        prsmerged: 3,
        comments: 15,
        timeToMerge: "1 day",
      },
      timestamp: "2024-06-09",
    },
    {
      id: 3,
      project: {
        title: "Node.js API Framework",
        description:
          "Lightweight, scalable REST API framework with built-in authentication and database integration.",
        url: "https://github.com/example/nodejs-api-framework",
      },
      student: {
        name: "Raj Kumar",
        avatar: "RK",
        profileUrl: "/profile/raj-kumar",
        badge: {
          name: "Shiksharthi",
          level: "shiksharthi",
          tooltip: "Shiksharthi – Rising talent",
        },
      },
      skills: ["Node.js", "Express", "MongoDB", "JWT"],
      matchedSkills: ["Node.js", "Express"],
      contributionType: { name: "Documentation", type: "docs" },
      metrics: {
        prsmerged: 2,
        comments: 8,
        timeToMerge: "3 days",
      },
      timestamp: "2024-06-08",
    },
    {
      id: 4,
      project: {
        title: "Machine Learning Optimization",
        description:
          "Performance optimization library for ML models with GPU acceleration support.",
        url: "https://github.com/example/ml-optimization",
      },
      student: {
        name: "Ananya Singh",
        avatar: "AS",
        profileUrl: "/profile/ananya-singh",
        badge: {
          name: "Guru",
          level: "guru",
          tooltip: "Guru – 10+ 5-star reviews",
        },
      },
      skills: ["Python", "TensorFlow", "CUDA", "C++"],
      matchedSkills: ["Python", "TensorFlow"],
      contributionType: { name: "Performance", type: "feature" },
      metrics: {
        prsmerged: 7,
        comments: 31,
        timeToMerge: "4 days",
      },
      timestamp: "2024-06-07",
    },
  ];

  const topContributors = [
    {
      rank: 1,
      name: "Arjun Patel",
      avatar: "AP",
      stats: "25 PRs",
      badge: "Guru",
    },
    {
      rank: 2,
      name: "Ananya Singh",
      avatar: "AS",
      stats: "22 PRs",
      badge: "Guru",
    },
    {
      rank: 3,
      name: "Priya Sharma",
      avatar: "PS",
      stats: "18 PRs",
      badge: "Acharya",
    },
    {
      rank: 4,
      name: "Raj Kumar",
      avatar: "RK",
      stats: "12 PRs",
      badge: "Shiksharthi",
    },
    {
      rank: 5,
      name: "Dev Patel",
      avatar: "DP",
      stats: "10 PRs",
      badge: "Shiksharthi",
    },
  ];

  const filters = [
    { id: "all", label: "All" },
    { id: "react", label: "React" },
    { id: "python", label: "Python" },
    { id: "javascript", label: "JavaScript" },
    { id: "recent", label: "Most Recent" },
    { id: "top", label: "Top Contributors" },
  ];

  // Filter contributions based on search and active filter
  const filteredContributions = useMemo(() => {
    return contributions.filter((contribution) => {
      const matchesSearch =
        searchTerm === "" ||
        contribution.student.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contribution.project.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contribution.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "react" && contribution.skills.includes("React")) ||
        (activeFilter === "python" && contribution.skills.includes("Python")) ||
        (activeFilter === "javascript" &&
          contribution.skills.includes("JavaScript")) ||
        activeFilter === "recent" ||
        (activeFilter === "top" && contribution.student.badge.level === "guru");

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const getBadgeColor = (level) => {
    switch (level) {
      case "guru":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "acharya":
        return "bg-gradient-to-r from-purple-500 to-indigo-500";
      case "shiksharthi":
        return "bg-gradient-to-r from-green-500 to-teal-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getContributionTypeStyle = (type) => {
    switch (type) {
      case "feature":
        return "bg-green-100 text-green-800";
      case "bugfix":
        return "bg-yellow-100 text-yellow-800";
      case "docs":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleShortlist = (studentName) => {
    alert(`${studentName} has been shortlisted!`);
  };

  const handleViewContribution = (projectTitle) => {
    alert(`Viewing full contribution for ${projectTitle}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-10 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Open Source Contributions
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Browse students contributing to community projects. Spot top talent
            through their real-world impact.
          </p>
        </div>
      </header>

      {/* Search & Filters */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-5">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name, skill, or project…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contribution Feed */}
          <div className="lg:col-span-3 space-y-6">
            {filteredContributions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No contributions found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredContributions.map((contribution) => (
                <article
                  key={contribution.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Project Header */}
                  <div className="mb-4">
                    <a
                      href={contribution.project.url}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-2 block"
                    >
                      {contribution.project.title}
                    </a>
                    <p className="text-gray-500 text-sm mb-3">
                      {contribution.project.description}
                    </p>
                    <a
                      href={contribution.project.url}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Github className="w-4 h-4" />
                      View Repository
                    </a>
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                      {contribution.student.avatar}
                    </div>
                    <div className="flex-1">
                      <a
                        href={contribution.student.profileUrl}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {contribution.student.name}
                      </a>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {contribution.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              contribution.matchedSkills.includes(skill)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="group relative">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold ${getBadgeColor(
                          contribution.student.badge.level
                        )}`}
                      >
                        <Star className="w-3 h-3" />
                        {contribution.student.badge.name}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {contribution.student.badge.tooltip}
                      </div>
                    </div>
                  </div>

                  {/* Contribution Type */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getContributionTypeStyle(
                        contribution.contributionType.type
                      )}`}
                    >
                      {contribution.contributionType.name}
                    </span>
                  </div>

                  {/* Impact Metrics */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-blue-600" />
                      <span>{contribution.metrics.prsmerged} PRs Merged</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      <span>{contribution.metrics.comments} Comments</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{contribution.metrics.timeToMerge} to Merge</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleShortlist(contribution.student.name)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                    >
                      Shortlist Student
                    </button>
                    <button
                      onClick={() =>
                        handleViewContribution(contribution.project.title)
                      }
                      className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all"
                    >
                      View Full Contribution
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Contributors
                </h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((contributor) => (
                  <div
                    key={contributor.rank}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="font-bold text-blue-600 text-lg min-w-[20px]">
                      {contributor.rank}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                      {contributor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {contributor.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {contributor.stats}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {contributor.badge}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OpenSourceContributions;
