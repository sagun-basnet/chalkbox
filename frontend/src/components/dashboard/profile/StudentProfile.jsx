import React, { useState } from 'react';
import girls from "../../../assets/OIP.jpg";
import { 
  Mail, 
  Star, 
  Award, 
  BookOpen, 
  Users, 
  Calendar,
  MapPin,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const StudentProfile= () => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Sample student data
  const studentData = {
    name: "Priya Sharma",
    email: "priya.sharma@student.edu",
    profilePicture: girls,
    bio: "Passionate computer science student with a keen interest in web development and AI. Always eager to learn new technologies and collaborate on innovative projects.",
    location: "Kathmandu, Nepal",
    skills: ["React", "JavaScript", "Python", "Machine Learning", "UI/UX Design", "Node.js"],
    badges: [
      { id: 1, name: "Guru", icon: "🎓", description: "Exceptional mentor and knowledge sharer" },
      { id: 2, name: "Acharya", icon: "📚", description: "Master of traditional wisdom" },
      { id: 3, name: "Utsaahi", icon: "🚀", description: "Enthusiastic learner and participant" }
    ],
    reviews: {
      average: 4.8,
      count: 24,
      stars: 5
    },
    workshopsAttended: {
      count: 12,
      recent: [
        { id: 1, title: "React Fundamentals", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&h=60&fit=crop" },
        { id: 2, title: "AI Ethics Workshop", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=80&h=60&fit=crop" },
        { id: 3, title: "Design Thinking", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=60&fit=crop" }
      ]
    },
    workshopsHosted: {
      count: 3,
      rating: 4.9,
      isEligibleHost: true
    },
    applications: [
      { id: 1, title: "Frontend Developer Intern", company: "TechCorp", status: "Pending" },
      { id: 2, title: "UI/UX Designer", company: "Design Studio", status: "Accepted" },
      { id: 3, title: "Full Stack Developer", company: "StartupXYZ", status: "Rejected" }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircle className="w-3 h-3" />;
      case 'Rejected': return <XCircle className="w-3 h-3" />;
      case 'Pending': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="px-6 sm:px-8 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6 gap-6">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20student%20with%20a%20friendly%20smile%2C%20high%20quality%2C%20professional%20lighting%2C%20blue%20background%2C%20clean%20portrait%2C%20professional%20headshot%2C%20detailed%20facial%20features&width=200&height=200&seq=1&orientation=squarish"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-[#2A66DE] object-cover bg-white"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Aditya Sharma
                    </h1>
                    <p className="text-gray-500 text-sm">
                      aditya.sharma@email.com
                    </p>
                  </div>
                  <button className="mt-3 sm:mt-0 bg-[#2A66DE] text-white px-4 py-2 rounded-lg !rounded-button whitespace-nowrap hover:bg-blue-700 transition cursor-pointer flex items-center gap-2">
                    <i className="fas fa-pen text-xs"></i>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Bio</h2>
              <p className="text-gray-600 leading-relaxed">
                Computer Science student at Delhi University with a passion for
                AI and machine learning. I've been coding for 4 years and enjoy
                participating in hackathons and tech workshops. Looking to
                collaborate on innovative projects that make a difference.
              </p>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "Machine Learning",
                  "React",
                  "Node.js",
                  "Data Analysis",
                  "UI/UX Design",
                  "Project Management",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-[#2A66DE] border border-[#2A66DE] rounded-full text-sm whitespace-nowrap cursor-pointer hover:bg-blue-100 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 sm:px-8 mb-8">
          {/* Reviews */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
            <div className="text-gray-500 mb-1 text-sm">Reviews Received</div>
            <div className="flex items-center gap-1 mb-1">
              <i className="fas fa-star text-yellow-400"></i>
              <span className="font-bold text-xl">4.8</span>
            </div>
            <div className="text-sm text-gray-500">from 24 reviews</div>
          </div>

          {/* Workshops Attended */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
            <div className="text-gray-500 mb-1 text-sm">Workshops Attended</div>
            <div className="font-bold text-xl mb-1">12</div>
            <div className="flex gap-1">
              <img
                src="https://readdy.ai/api/search-image?query=tech%20workshop%20with%20students%20learning%20coding%2C%20professional%20setting%2C%20blue%20theme%2C%20educational%20environment%2C%20clean%20modern%20classroom&width=40&height=40&seq=2&orientation=squarish"
                alt="Workshop"
                className="w-8 h-8 rounded-md object-cover"
              />
              <img
                src="https://readdy.ai/api/search-image?query=data%20science%20workshop%20with%20students%20analyzing%20data%2C%20professional%20setting%2C%20blue%20theme%2C%20educational%20environment%2C%20clean%20modern%20classroom&width=40&height=40&seq=3&orientation=squarish"
                alt="Workshop"
                className="w-8 h-8 rounded-md object-cover"
              />
              <img
                src="https://readdy.ai/api/search-image?query=AI%20workshop%20with%20students%20working%20on%20machine%20learning%2C%20professional%20setting%2C%20blue%20theme%2C%20educational%20environment%2C%20clean%20modern%20classroom&width=40&height=40&seq=4&orientation=squarish"
                alt="Workshop"
                className="w-8 h-8 rounded-md object-cover"
              />
              <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                +9
              </div>
            </div>
          </div>

          {/* Workshops Hosted */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
            <div className="text-gray-500 mb-1 text-sm">Workshops Hosted</div>
            <div className="font-bold text-xl mb-1">3</div>
            <div className="flex items-center gap-1 text-sm">
              <i className="fas fa-star text-yellow-400 text-xs"></i>
              <span className="text-gray-500">4.9 avg rating</span>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="px-6 sm:px-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Badges & Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Guru",
                icon: "fa-award",
                description: "Recognized for exceptional teaching abilities",
              },
              {
                name: "Acharya",
                icon: "fa-graduation-cap",
                description: "Demonstrated academic excellence",
              },
              {
                name: "Shiksharthi",
                icon: "fa-book",
                description: "Dedicated lifelong learner",
              },
              {
                name: "Utsaahi Intern",
                icon: "fa-briefcase",
                description: "Enthusiastic intern with outstanding performance",
              },
            ].map((badge) => (
              <div
                key={badge.name}
                className="bg-blue-50 rounded-lg p-4 flex flex-col items-center group relative cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#2A66DE] mb-2">
                  <i className={`fas ${badge.icon} text-xl`}></i>
                </div>
                <div className="font-medium text-gray-800">{badge.name}</div>
                <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 w-full max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Section */}
        <div className="px-6 sm:px-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Applications
          </h2>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {[
              {
                title: "Machine Learning Intern",
                company: "TechCorp",
                status: "Accepted",
                date: "June 5, 2025",
              },
              {
                title: "Data Science Workshop Host",
                company: "ChalkBox",
                status: "Pending",
                date: "June 8, 2025",
              },
              {
                title: "Frontend Developer",
                company: "WebSolutions",
                status: "Rejected",
                date: "May 28, 2025",
              },
            ].map((application, index) => (
              <div
                key={index}
                className={`p-4 flex justify-between items-center ${index % 2 === 0 ? "bg-white" : ""}`}
              >
                <div>
                  <div className="font-medium text-gray-800">
                    {application.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {application.company} • {application.date}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    application.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : application.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {application.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 sm:px-8 pb-8 flex flex-wrap gap-3">
          <button className="bg-[#2A66DE] text-white px-4 py-2 rounded-lg !rounded-button whitespace-nowrap hover:bg-blue-700 transition cursor-pointer flex items-center gap-2">
            <i className="fas fa-chalkboard-teacher"></i>
            View Workshops
          </button>
          <button className="border border-[#2A66DE] text-[#2A66DE] px-4 py-2 rounded-lg !rounded-button whitespace-nowrap hover:bg-blue-50 transition cursor-pointer flex items-center gap-2">
            <i className="fas fa-certificate"></i>
            View Certificates
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg !rounded-button whitespace-nowrap hover:bg-gray-50 transition cursor-pointer flex items-center gap-2">
            <i className="fas fa-share-alt"></i>
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;