import React, { useState } from 'react';
import { 
  MapPin, 
  Globe, 
  Calendar, 
  User, 
  Mail, 
  Edit3, 
  Eye, 
  MessageSquare, 
  Star,
  Github,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Play,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [isOwner, setIsOwner] = useState(true); // Toggle this to see different views

  // Sample data
  const companyData = {
    name: "TechInnovate Solutions",
    tagline: "Building tomorrow's technology today",
    logo: "🚀",
    profileImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
    location: "San Francisco, CA",
    website: "https://techinnovate.com",
    joinedDate: "March 2023",
    contactPerson: "Sarah Johnson",
    email: "sarah@techinnovate.com",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    about: `TechInnovate Solutions is a cutting-edge technology company focused on developing innovative software solutions that transform how businesses operate. We believe in fostering talent, encouraging creativity, and building products that make a real difference in people's lives.

Our mission is to bridge the gap between academic learning and industry practice by providing students with real-world experience through meaningful projects. We're committed to creating an inclusive, collaborative environment where fresh perspectives are valued and nurtured.

We specialize in AI/ML solutions, web development, mobile applications, and cloud infrastructure. Our team consists of passionate engineers, designers, and product managers who are dedicated to mentoring the next generation of tech professionals.`,
    totalJobs: 24,
    successfulHires: 18,
    rating: 4.8,
    badges: ['Verified Employer', 'Top Rated', 'Student Friendly']
  };

  const activeJobs = [
    {
      id: 1,
      title: "Frontend Developer - React/TypeScript",
      postedDate: "2 days ago",
      skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
      proposals: 12,
      status: "Open"
    },
    {
      id: 2,
      title: "Machine Learning Engineer Intern",
      postedDate: "1 week ago",
      skills: ["Python", "TensorFlow", "Pandas", "Data Analysis"],
      proposals: 8,
      status: "Open"
    },
    {
      id: 3,
      title: "UI/UX Designer - Mobile App",
      postedDate: "5 days ago",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      proposals: 15,
      status: "Open"
    }
  ];

  const pastJobs = [
    {
      id: 4,
      title: "Backend Developer - Node.js",
      postedDate: "2 months ago",
      skills: ["Node.js", "MongoDB", "Express", "AWS"],
      proposals: 20,
      status: "Completed"
    },
    {
      id: 5,
      title: "Data Analyst Intern",
      postedDate: "3 months ago",
      skills: ["SQL", "Python", "Power BI", "Statistics"],
      proposals: 14,
      status: "Completed"
    }
  ];

  const hiredStudents = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Frontend Developer",
      duration: "3 months",
      rating: 5,
      feedback: "Exceptional work ethic and technical skills",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      role: "Data Analyst",
      duration: "4 months",
      rating: 5,
      feedback: "Outstanding analytical thinking and communication",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "David Kim",
      role: "Backend Developer",
      duration: "6 months",
      rating: 4,
      feedback: "Strong technical foundation and great team player",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const openSourceProjects = [
    {
      id: 1,
      name: "React Component Library",
      description: "A comprehensive UI component library built with React and TypeScript",
      githubUrl: "https://github.com/techinnovate/react-components",
      contributors: 8,
      featured: true
    },
    {
      id: 2,
      name: "ML Model Deployment Tool",
      description: "Simplified tool for deploying machine learning models to cloud platforms",
      githubUrl: "https://github.com/techinnovate/ml-deploy",
      contributors: 5,
      featured: false
    }
  ];

  const renderJobCard = (job, isPast = false) => (
    <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
          {job.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          job.status === 'Open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {job.status}
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        Posted {job.postedDate}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 flex items-center">
          <MessageSquare className="w-4 h-4 mr-1" />
          {job.proposals} proposals
        </span>
        
        {isOwner && (
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Edit3 className="w-4 h-4 inline mr-1" />
              Edit
            </button>
            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
              <Eye className="w-4 h-4 inline mr-1" />
              View Proposals
            </button>
            {!isPast && (
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                <XCircle className="w-4 h-4 inline mr-1" />
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStudentCard = (student) => (
    <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-blue-600 font-medium">{student.role}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < student.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-2">Duration: {student.duration}</p>
      <p className="text-gray-700 text-sm italic">"{student.feedback}"</p>
    </div>
  );

  const renderProjectCard = (project) => (
    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {project.name}
            {project.featured && (
              <Award className="w-4 h-4 ml-2 text-yellow-500" />
            )}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{project.description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {project.contributors} contributors
        </span>
        
        <a 
          href={project.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <Github className="w-4 h-4 mr-1" />
          View on GitHub
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img 
                  src={companyData.profileImage} 
                  alt={`${companyData.name} logo`}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 text-2xl">{companyData.logo}</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-600">{companyData.name}</h1>
                <p className="text-gray-600 mt-1">{companyData.tagline}</p>
              </div>
            </div>
            
            {isOwner && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{companyData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href={companyData.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 flex items-center">
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Joined {companyData.joinedDate}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{companyData.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${companyData.email}`} className="text-blue-600 hover:text-blue-800">
                    {companyData.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <a href={companyData.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 flex items-center">
                    LinkedIn Profile
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                {companyData.about.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'active'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔵 Active Jobs ({activeJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'past'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🕒 Past Jobs ({pastJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('hired')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'hired'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🧑‍🎓 Hired Students ({hiredStudents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'projects'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔧 Open Source ({openSourceProjects.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'active' && (
                  <div className="space-y-4">
                    {activeJobs.map(job => renderJobCard(job))}
                  </div>
                )}

                {activeTab === 'past' && (
                  <div className="space-y-4">
                    {pastJobs.map(job => renderJobCard(job, true))}
                  </div>
                )}

                {activeTab === 'hired' && (
                  <div className="space-y-4">
                    {hiredStudents.map(student => renderStudentCard(student))}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    {openSourceProjects.map(project => renderProjectCard(project))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Badges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🌟 Company Reputation</h3>
              
              <div className="space-y-4">
                {companyData.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{badge}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Total Jobs Posted
                  </span>
                  <span className="font-semibold text-gray-900">{companyData.totalJobs}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Successful Hires
                  </span>
                  <span className="font-semibold text-gray-900">{companyData.successfulHires}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Student Rating
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900">{companyData.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(companyData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            {!isOwner && (
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Contact Company
              </button>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((companyData.successfulHires / companyData.totalJobs) * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Openings</span>
                  <span className="font-semibold text-blue-600">{activeJobs.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Open Source Projects</span>
                  <span className="font-semibold text-purple-600">{openSourceProjects.length}</span>
                </div>
              </div>
            </div>

            {/* Toggle View (for demo purposes) */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Controls:</h4>
              <button
                onClick={() => setIsOwner(!isOwner)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-gray-700"
              >
                Switch to {isOwner ? 'Public' : 'Owner'} View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;