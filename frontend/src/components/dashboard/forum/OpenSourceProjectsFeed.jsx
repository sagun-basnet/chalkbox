import React, { useState } from "react";
import {
  Search,
  Github,
  Clock,
  Users,
  Star,
  ExternalLink,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Target,
} from "lucide-react";

const OpenSourceProjectsFeed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Mock data for projects
  const projects = [
    {
      id: 1,
      employer: {
        name: "TechFlow Inc",
        logo: "🏢",
        verified: true,
      },
      postedDate: "2 days ago",
      title: "E-commerce Dashboard Analytics",
      description:
        "Build interactive analytics dashboard for e-commerce platform with real-time data visualization and user behavior tracking.",
      techStack: ["React", "TypeScript", "D3.js", "Node.js"],
      difficulty: "Intermediate",
      goals: [
        "Implement responsive data visualization components",
        "Add user behavior tracking features",
        "Optimize performance for large datasets",
      ],
      githubUrl: "https://github.com/techflow/ecommerce-dashboard",
      hiringLabel: "Looking to hire contributors for internships/jobs",
      fullDescription:
        "This project aims to create a comprehensive analytics dashboard for e-commerce platforms. Contributors will work on building interactive charts, implementing real-time data updates, and creating responsive components that work across different screen sizes.",
      contributionGuidelines:
        "Please read our CONTRIBUTING.md file and follow our code style guidelines. All PRs should include tests and documentation updates.",
      goodFirstIssues: [
        "Add dark mode toggle component",
        "Implement responsive navigation",
        "Create loading skeleton components",
      ],
    },
    {
      id: 2,
      employer: {
        name: "CloudSync Solutions",
        logo: "☁️",
        verified: true,
      },
      postedDate: "5 days ago",
      title: "AI-Powered File Organization Tool",
      description:
        "Develop an intelligent file management system that automatically categorizes and organizes files using machine learning algorithms.",
      techStack: ["Python", "TensorFlow", "Flask", "React"],
      difficulty: "Advanced",
      goals: [
        "Implement ML model for file categorization",
        "Create intuitive user interface",
        "Add batch processing capabilities",
      ],
      githubUrl: "https://github.com/cloudsync/ai-file-organizer",
      hiringLabel: null,
      fullDescription:
        "An innovative project combining AI and file management. We're building a tool that can intelligently organize files based on content, metadata, and user patterns. This is perfect for contributors interested in machine learning and practical applications.",
      contributionGuidelines:
        "Contributions should include comprehensive tests. Please ensure your ML models are well-documented and include performance metrics.",
      goodFirstIssues: [
        "Add file type detection utility",
        "Implement progress bar for batch operations",
        "Create unit tests for ML pipeline",
      ],
    },
    {
      id: 3,
      employer: {
        name: "EduTech Innovations",
        logo: "🎓",
        verified: true,
      },
      postedDate: "1 week ago",
      title: "Interactive Learning Platform",
      description:
        "Build gamified learning experiences with progress tracking, achievements, and collaborative features for online education.",
      techStack: ["Vue.js", "Express", "MongoDB", "Socket.io"],
      difficulty: "Easy",
      goals: [
        "Design engaging user interface",
        "Implement real-time collaboration",
        "Add gamification elements",
      ],
      githubUrl: "https://github.com/edutech/learning-platform",
      hiringLabel: "Open to hiring top contributors",
      fullDescription:
        "We're creating the next generation of online learning platforms with a focus on engagement and collaboration. This project welcomes contributors of all skill levels and offers mentorship opportunities.",
      contributionGuidelines:
        "Perfect for beginners! We provide detailed code reviews and mentorship. Start with good first issues and work your way up to more complex features.",
      goodFirstIssues: [
        "Add user profile avatars",
        "Implement achievement badges",
        "Create responsive layout components",
      ],
    },
  ];

  // Mock contributions data
  const myContributions = [
    {
      id: 1,
      projectTitle: "E-commerce Dashboard Analytics",
      status: "Under Review",
      prLink: "https://github.com/techflow/ecommerce-dashboard/pull/123",
      feedback: "Great work on the responsive components!",
    },
    {
      id: 2,
      projectTitle: "Interactive Learning Platform",
      status: "Shortlisted",
      prLink: "https://github.com/edutech/learning-platform/pull/45",
      feedback: "Impressive implementation of the achievement system.",
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.techStack.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDifficulty =
      !selectedDifficulty || project.difficulty === selectedDifficulty;
    const matchesTech =
      !selectedTech || project.techStack.includes(selectedTech);

    return matchesSearch && matchesDifficulty && matchesTech;
  });

  const allTechStacks = [
    ...new Set(projects.flatMap((project) => project.techStack)),
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Open Source Contributions
          </h1>
          <p className="text-gray-600 mb-6">
            Explore employer-backed open-source projects. Contribute to impress
            and get hired.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, technologies, or descriptions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
              >
                <option value="">All Technologies</option>
                {allTechStacks.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                My Contributions
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-6xl mx-auto">
        {/* Main Content */}
        <main className={`flex-1 px-4 py-6 ${showSidebar ? "md:mr-80" : ""}`}>
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Employer Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                      {project.employer.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {project.employer.name}
                        </h3>
                        {project.employer.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Posted {project.postedDate}
                      </div>
                    </div>
                  </div>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Project Title and Description */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Difficulty and Hiring Label */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>

                  {project.hiringLabel && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                      <Users className="w-4 h-4" />
                      {project.hiringLabel}
                    </div>
                  )}
                </div>

                {/* Project Goals */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Project Goals:
                  </h4>
                  <ul className="space-y-1">
                    {project.goals.map((goal, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  View Full Details
                </button>
              </article>
            ))}
          </div>
        </main>

        {/* Sidebar - My Contributions */}
        {showSidebar && (
          <aside className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l z-50 md:relative md:top-auto md:h-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  My Contributions
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {myContributions.map((contribution) => (
                  <div
                    key={contribution.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {contribution.projectTitle}
                    </h4>
                    <div className="space-y-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          contribution.status
                        )}`}
                      >
                        {contribution.status}
                      </span>
                      <a
                        href={contribution.prLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View PR <ExternalLink className="w-3 h-3" />
                      </a>
                      {contribution.feedback && (
                        <p className="text-sm text-gray-600 italic">
                          "{contribution.feedback}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Modal for Project Details */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProject.title}
                </h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Full Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.fullDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Contribution Guidelines
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.contributionGuidelines}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Good First Issues
                  </h3>
                  <ul className="space-y-2">
                    {selectedProject.goodFirstIssues.map((issue, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    View Repository
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    Mark as Contributed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenSourceProjectsFeed;
