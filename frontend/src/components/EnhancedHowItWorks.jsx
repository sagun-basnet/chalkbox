import React, { useState, useEffect } from "react";
import { Target, Globe, Zap, ArrowRight, CheckCircle } from "lucide-react";

const AnimatedSection = ({ children, id, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      id={id}
      className={`transition-all duration-1000 ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const ProgressLine = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hidden lg:block absolute top-[-3rem] left-0 right-0 transform -translate-y-1/2 px-10">
      {/* Background line */}
      <div className="h-1 bg-gray-200 rounded-full relative overflow-hidden">
        {/* Animated progress line */}
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full transition-all duration-3000 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Flowing animation effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Connection dots and arrows */}
      <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center">
          <CheckCircle
            className="text-green-500 bg-white rounded-full"
            size={16}
          />
          <ArrowRight className="text-gray-400 ml-2" size={16} />
        </div>
      </div>

      <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center">
          <CheckCircle
            className="text-green-500 bg-white rounded-full"
            size={16}
          />
          <ArrowRight className="text-gray-400 ml-2" size={16} />
        </div>
      </div>

      {/* Journey labels */}
      <div className="absolute -bottom-8 left-1/6 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
        Profile Setup
      </div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
        Find Opportunities
      </div>
      <div className="absolute -bottom-8 left-5/6 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
        Start Earning
      </div>
    </div>
  );
};

export default function EnhancedHowItWorks() {
  return (
    <AnimatedSection id="section-how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey from student to professional in three simple steps
          </p>
        </div>

        <div className="relative mb-8">
          <ProgressLine />

          <div className="grid lg:grid-cols-3 gap-12 relative">
            <AnimatedSection
              id="section-step-1"
              delay={100}
              className="text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Target className="text-white" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shadow-md border-2 border-blue-100">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Create Your Student Profile
              </h3>
              <p className="text-gray-600">
                Set up your profile, showcase your skills, and define your
                learning goals to get discovered by opportunities
              </p>
            </AnimatedSection>

            <AnimatedSection
              id="section-step-2"
              delay={200}
              className="text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Globe className="text-white" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-green-600 shadow-md border-2 border-green-100">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Apply to Jobs or Host a Workshop
              </h3>
              <p className="text-gray-600">
                Find opportunities that match your skills or share your
                knowledge with others in our global community
              </p>
            </AnimatedSection>

            <AnimatedSection
              id="section-step-3"
              delay={300}
              className="text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Zap className="text-white" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-purple-600 shadow-md border-2 border-purple-100">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Finalize Smart Agreement & Start Earning
              </h3>
              <p className="text-gray-600">
                Secure your opportunities with blockchain-based contracts and
                start building your career with confidence
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Success metrics */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Join thousands of students who've already started their journey
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>5,000+ Profiles Created</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>2,000+ Opportunities Matched</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>1,500+ Contracts Completed</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
