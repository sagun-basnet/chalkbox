import React, { useState } from 'react';
import { Plus, X, ChevronDown, Briefcase, Target, Code, FileText, Users, CheckCircle } from 'lucide-react';

const Collaboration = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    subtitle: '',
    requiredSkills: [],
    level: '',
    projectGoals: [],
    description: '',
    contributionGuidelines: '',
    goodFirstIssues: []
  });

  const [inputStates, setInputStates] = useState({
    skillInput: '',
    showSkillInput: false,
    goalInput: '',
    showGoalInput: false,
    issueInput: '',
    showIssueInput: false
  });

  const levels = ['Easy', 'Intermediate', 'Advanced'];

  // Handle basic input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle skills
  const addSkill = () => {
    if (inputStates.skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, inputStates.skillInput.trim()]
      }));
      setInputStates(prev => ({ ...prev, skillInput: '', showSkillInput: false }));
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Handle project goals
  const addGoal = () => {
    if (inputStates.goalInput.trim()) {
      setFormData(prev => ({
        ...prev,
        projectGoals: [...prev.projectGoals, inputStates.goalInput.trim()]
      }));
      setInputStates(prev => ({ ...prev, goalInput: '', showGoalInput: false }));
    }
  };

  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      projectGoals: prev.projectGoals.filter((_, i) => i !== index)
    }));
  };

  const handleGoalKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGoal();
    }
  };

  // Handle good first issues
  const addIssue = () => {
    if (inputStates.issueInput.trim()) {
      setFormData(prev => ({
        ...prev,
        goodFirstIssues: [...prev.goodFirstIssues, inputStates.issueInput.trim()]
      }));
      setInputStates(prev => ({ ...prev, issueInput: '', showIssueInput: false }));
    }
  };

  const removeIssue = (index) => {
    setFormData(prev => ({
      ...prev,
      goodFirstIssues: prev.goodFirstIssues.filter((_, i) => i !== index)
    }));
  };

  const handleIssueKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIssue();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#2A66DE'}}>
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
              <p className="text-gray-600 mt-1">Create an exciting opportunity for talented students</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-8">
            
            {/* Job Title */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="Frontend Intern - React.js"
                className="w-full px-6 py-4 text-xl font-medium border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                style={{focusRingColor: '#2A66DE'}}
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="Exciting opportunity for MERN learners!"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Code className="w-5 h-5 mr-2" style={{color: '#2A66DE'}} />
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm"
                    style={{backgroundColor: '#2A66DE'}}
                  >
                    #{skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-white hover:text-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                
                {inputStates.showSkillInput ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputStates.skillInput}
                      onChange={(e) => setInputStates(prev => ({ ...prev, skillInput: e.target.value }))}
                      onKeyPress={handleSkillKeyPress}
                      onBlur={addSkill}
                      placeholder="Type skill name..."
                      className="px-3 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{focusRingColor: '#2A66DE'}}
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setInputStates(prev => ({ ...prev, showSkillInput: true }))}
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed rounded-full text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    style={{
                      borderColor: '#2A66DE',
                      color: '#2A66DE'
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Level
              </label>
              <div className="relative">
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
                  onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  required
                >
                  <option value="">Select difficulty level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Project Goals */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" style={{color: '#2A66DE'}} />
                Project Goals
              </label>
              <div className="space-y-2 mb-4">
                {formData.projectGoals.map((goal, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: '#2A66DE'}}></div>
                    <span className="flex-1 text-gray-700">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {inputStates.showGoalInput ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputStates.goalInput}
                    onChange={(e) => setInputStates(prev => ({ ...prev, goalInput: e.target.value }))}
                    onKeyPress={handleGoalKeyPress}
                    placeholder="Enter project goal..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addGoal}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{backgroundColor: '#2A66DE'}}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setInputStates(prev => ({ ...prev, showGoalInput: true }))}
                  className="inline-flex items-center px-4 py-2 border-2 border-dashed rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                  style={{
                    borderColor: '#2A66DE',
                    color: '#2A66DE'
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project Goal
                </button>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" style={{color: '#2A66DE'}} />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this job in detail..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
                style={{minHeight: '120px'}}
                required
              />
            </div>

            {/* Contribution Guidelines */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" style={{color: '#2A66DE'}} />
                Contribution Guidelines
              </label>
              <p className="text-sm text-gray-600 mb-3">What should students know before applying?</p>
              <textarea
                value={formData.contributionGuidelines}
                onChange={(e) => handleInputChange('contributionGuidelines', e.target.value)}
                placeholder="Provide clear guidelines for students..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
                style={{minHeight: '100px'}}
              />
            </div>

            {/* Good First Issues */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" style={{color: '#2A66DE'}} />
                Good First Issues
              </label>
              <div className="space-y-2 mb-4">
                {formData.goodFirstIssues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: '#2A66DE'}}></div>
                    <span className="flex-1 text-gray-700">{issue}</span>
                    <button
                      type="button"
                      onClick={() => removeIssue(index)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {inputStates.showIssueInput ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputStates.issueInput}
                    onChange={(e) => setInputStates(prev => ({ ...prev, issueInput: e.target.value }))}
                    onKeyPress={handleIssueKeyPress}
                    placeholder="e.g., Fix button alignment on mobile"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px #2A66DE40`}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addIssue}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{backgroundColor: '#2A66DE'}}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setInputStates(prev => ({ ...prev, showIssueInput: true }))}
                  className="inline-flex items-center px-4 py-2 border-2 border-dashed rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                  style={{
                    borderColor: '#2A66DE',
                    color: '#2A66DE'
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Good First Issue
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                style={{backgroundColor: '#2A66DE'}}
              >
                Post Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;