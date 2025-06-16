import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Briefcase,
  Users,
  Award,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  Target,
  Globe,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import EnhancedHowItWorks from "../components/EnhancedHowItWorks";

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      quote:
        "ChalkBox helped me land my first internship and teach MERN stack workshops!",
      name: "Priya Sharma",
      role: "Computer Science Student",
      avatar: "PS",
    },
    {
      quote:
        "The AI suggestions perfectly matched my skills with amazing job opportunities.",
      name: "Rohit Thapa",
      role: "Engineering Student",
      avatar: "RT",
    },
    {
      quote:
        "Earning reputation badges motivated me to learn new technologies faster.",
      name: "Sushma Gautam",
      role: "IT Student",
      avatar: "SG",
    },
  ];

  const badges = [
    { name: "Shiksharthi", description: "The Eager Learner", icon: "🎓" },
    { name: "Guru", description: "The Knowledge Sharer", icon: "👨‍🏫" },
    { name: "Acharya", description: "The Master Teacher", icon: "🧠" },
    {
      name: "Utsaahi Intern",
      description: "The Enthusiastic Professional",
      icon: "💼",
    },
  ];

  const AnimatedSection = ({ children, id, className = "", delay = 0 }) => (
    <div
      id={id}
      className={`transition-all duration-1000 ease-out ${
        isVisible[id] && "opacity-100 translate-y-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-white font-sans">
        {/* Hero Section */}
        <AnimatedSection
          id="section-hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div
              className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering <span className="text-blue-600"> Students</span> to
                Learn, Teach, and Earn
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Showcase your skills, host workshops, apply to verified
                internships, and earn reputation — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2">
                  <Briefcase size={20} />
                  Explore Jobs
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <Users size={20} />
                  Host a Workshop
                </button>
              </div>

              {/* Hero Illustration */}
              <div className="relative max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <BookOpen className="text-blue-600" size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Learn Skills
                      </p>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <Users className="text-green-600" size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Teach Others
                      </p>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <Award className="text-purple-600" size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Earn Recognition
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Personalized Dashboard Preview */}
        <AnimatedSection id="section-dashboard" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Your Personalized Career Hub
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                AI-powered recommendations tailored to your skills and career
                goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedSection
                id="section-dashboard-1"
                delay={100}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  New Workshops for You
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover workshops matching your interests and skill level
                </p>
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="font-medium text-blue-900">
                      React Advanced Patterns
                    </p>
                    <p className="text-sm text-blue-600">Tomorrow, 2:00 PM</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="font-medium text-green-900">
                      UI/UX Design Fundamentals
                    </p>
                    <p className="text-sm text-green-600">This Weekend</p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection
                id="section-dashboard-2"
                delay={200}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Jobs Matching Your Skills
                </h3>
                <p className="text-gray-600 mb-4">
                  Internships and opportunities curated for you
                </p>
                <div className="space-y-2">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="font-medium text-green-900">
                      Frontend Developer Intern
                    </p>
                    <p className="text-sm text-green-600">95% Match • Remote</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-medium text-purple-900">
                      React Developer
                    </p>
                    <p className="text-sm text-purple-600">
                      88% Match • Hybrid
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection
                id="section-dashboard-3"
                delay={300}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Next Skill You Can Learn
                </h3>
                <p className="text-gray-600 mb-4">
                  ML-powered suggestions for your learning path
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-purple-900">
                      Docker & Containers
                    </p>
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-purple-600 mb-3">
                    Based on your MERN stack knowledge
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-purple-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-purple-600">
                      75% relevant
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* Platform Features Grid */}
        <AnimatedSection id="section-features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From skill showcasing to earning opportunities, we've got you
                covered
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedSection
                id="section-feature-1"
                delay={100}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Showcase Portfolio & Badges
                </h3>
                <p className="text-gray-600">
                  Build your digital reputation with verified skills and
                  achievements
                </p>
              </AnimatedSection>

              <AnimatedSection
                id="section-feature-2"
                delay={200}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-green-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Teach Zoom Workshops & Earn Tokens
                </h3>
                <p className="text-gray-600">
                  Share your knowledge and earn rewards for teaching others
                </p>
              </AnimatedSection>

              <AnimatedSection
                id="section-feature-3"
                delay={300}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="text-purple-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Apply to Verified Internships
                </h3>
                <p className="text-gray-600">
                  Access quality internship opportunities from trusted companies
                </p>
              </AnimatedSection>

              <AnimatedSection
                id="section-feature-4"
                delay={400}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-orange-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Smart Job Contracts via Blockchain
                </h3>
                <p className="text-gray-600">
                  Secure, transparent agreements without complex crypto
                </p>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works */}
        <EnhancedHowItWorks />

        {/* Badges & Gamification */}
        <AnimatedSection id="section-badges" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Earn Recognition with Culturally Inspired Badges
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Unlock achievements that celebrate your journey in learning and
                teaching
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {badges.map((badge, index) => (
                <AnimatedSection
                  key={badge.name}
                  id={`section-badge-${index}`}
                  delay={index * 100}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <div className="text-4xl mb-4">{badge.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {badge.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{badge.description}</p>
                    <div className="mt-4 flex justify-center">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection id="section-testimonials" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Students Say About ChalkBox
              </h2>
              <p className="text-xl text-gray-600">
                Real stories from students who transformed their careers
              </p>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl text-blue-500 mb-4">"</div>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {testimonials[currentTestimonial].quote}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() =>
                    setCurrentTestimonial(
                      (prev) =>
                        (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>

                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentTestimonial(
                      (prev) => (prev + 1) % testimonials.length
                    )
                  }
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ML Matching Preview */}
        <AnimatedSection id="section-ml-matching" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                AI Suggestions Tailored to You
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Smart recommendations that understand your learning journey
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <Lightbulb className="text-yellow-500" size={32} />
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <p className="text-lg font-medium text-gray-800 mb-2">
                  You learned{" "}
                  <span className="text-blue-600 font-bold">MERN Stack</span> –
                  next up:{" "}
                  <span className="text-purple-600 font-bold">Docker</span>
                </p>
                <p className="text-gray-600">
                  Based on your current skills and industry trends
                </p>
              </div>

              {/* Skill Flow Visualization */}
              <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium whitespace-nowrap">
                    ✅ HTML/CSS
                  </div>
                  <ArrowRight className="text-gray-400" size={20} />
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium whitespace-nowrap">
                    ✅ JavaScript
                  </div>
                  <ArrowRight className="text-gray-400" size={20} />
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium whitespace-nowrap">
                    ✅ MERN Stack
                  </div>
                  <ArrowRight className="text-gray-400" size={20} />
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium whitespace-nowrap animate-pulse">
                    📚 Docker
                  </div>
                  <ArrowRight className="text-gray-300" size={20} />
                  <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full font-medium whitespace-nowrap">
                    🔮 DevOps
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Start Learning Docker
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection
          id="section-cta"
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are building their future with
              ChalkBox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Get Started Free
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
