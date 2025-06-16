import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Code,
  FileText,
  Check,
  Tag,
  AlertCircle,
} from "lucide-react";
import { post } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const FreelanceProjectForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    requiredSkills: [],
    tags: ["Freelance"], // Default tag to ensure we have at least one
    type: "FREELANCE", // Default to FREELANCE
    location: "",
    locationType: "REMOTE", // Default to REMOTE
    budget: "",
  });

  const [inputStates, setInputStates] = useState({
    skillInput: "",
    showSkillInput: false,
    tagInput: "",
    showTagInput: false,
  });

  const textareaRef = useRef(null);
  const skillInputRef = useRef(null);
  const tagInputRef = useRef(null);

  const locationOptions = [
    { value: "REMOTE", label: "Remote", icon: "🌐" },
    { value: "ONSITE", label: "Onsite", icon: "🏢" },
    { value: "HYBRID", label: "Hybrid", icon: "🔄" },
  ];

  const jobTypeOptions = [
    { value: "FREELANCE", label: "Freelance", icon: "🔄" },
    { value: "CONTRACT", label: "Contract", icon: "📝" },
    { value: "PART_TIME", label: "Part Time", icon: "⌛" },
    { value: "FULL_TIME", label: "Full Time", icon: "⏰" },
    { value: "INTERNSHIP", label: "Internship", icon: "🎓" },
  ];

  const suggestedTags = [
    "Web",
    "Mobile",
    "Design",
    "Backend",
    "Frontend",
    "Full-stack",
    "UI/UX",
    "Database",
    "DevOps",
    "AI/ML",
  ];

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [formData.description]);

  // Focus input when shown
  useEffect(() => {
    if (inputStates.showSkillInput && skillInputRef.current) {
      skillInputRef.current.focus();
    }
    if (inputStates.showTagInput && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [inputStates.showSkillInput, inputStates.showTagInput]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
      handleInputChange("budget", value);
    }
  };

  // Skills handling
  const addSkill = () => {
    const skill = inputStates.skillInput.trim();
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill],
      }));
      setInputStates((prev) => ({
        ...prev,
        skillInput: "",
        showSkillInput: false,
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Escape") {
      setInputStates((prev) => ({
        ...prev,
        skillInput: "",
        showSkillInput: false,
      }));
    }
  };

  // Tags handling
  const addTag = () => {
    const tag = inputStates.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setInputStates((prev) => ({
        ...prev,
        tagInput: "",
        showTagInput: false,
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Escape") {
      setInputStates((prev) => ({
        ...prev,
        tagInput: "",
        showTagInput: false,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure we have at least one tag
      let finalFormData = { ...formData };

      // If tags array is empty, add a default tag based on the type
      if (finalFormData.tags.length === 0) {
        finalFormData.tags = [finalFormData.type.toLowerCase()];
      }

      // Format budget for API
      const jobData = {
        ...finalFormData,
        budget: finalFormData.budget
          ? `NPR ${finalFormData.budget}`
          : "Negotiable",
      };

      // Log the exact data being sent to API
      console.log("Submitting job data:", JSON.stringify(jobData, null, 2));

      // Make API request
      const response = await post("/api/jobs", jobData);
      console.log("Job created successfully:", response);

      
      // Check if response indicates success
      if (response.status === "success") {
        setSuccess(true);

        // Redirect to employer job dashboard after successful submission
        setTimeout(() => {
          navigate("/employer-dashboard/active-jobs");
        }, 2000);
      } else {
        // Handle unexpected response format
        setError("Unexpected response from server. Please try again.");
        console.warn("Unexpected API response format:", response);
      }
    } catch (error) {
      console.error("Error creating job:", error);

      // Extract error details for debugging
      const errorData = error.response?.data || {};
      const errorCode = errorData.code || "UNKNOWN_ERROR";
      const errorMessage =
        errorData.message || "Failed to create job. Please try again.";

      console.log("Error details:", {
        status: error.response?.status,
        code: errorCode,
        message: errorMessage,
        data: errorData,
      });

      // Set user-facing error message
      setError(`${errorMessage} (${errorCode})`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.budget &&
    formData.locationType &&
    formData.location &&
    formData.requiredSkills.length > 0 &&
    formData.tags.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Post Freelance Project
          </h1>
          <p className="text-gray-600">
            Connect with talented freelancers across Nepal
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            <span>Job posted successfully! Redirecting...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 text-red-800 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Project Title*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="E.g. Build an E-commerce Product Page"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Short Summary
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    handleInputChange("subtitle", e.target.value)
                  }
                  placeholder="E.g. Create a responsive modern design with payment integration"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Project Description*
              </label>
              <textarea
                ref={textareaRef}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Explain the project requirements, timeline, and expected outcomes..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 placeholder-gray-400 resize-none overflow-hidden"
                style={{ minHeight: "120px" }}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your requirements and expectations
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 flex items-center">
                <Code className="w-4 h-4 mr-1" />
                Required Skills*
              </label>

              {/* Skills Display */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-sm transition-all duration-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Skill Input */}
                {inputStates.showSkillInput ? (
                  <div className="inline-flex items-center bg-white border border-blue-300 rounded-full px-2 py-1 shadow-sm">
                    <input
                      ref={skillInputRef}
                      type="text"
                      value={inputStates.skillInput}
                      onChange={(e) =>
                        setInputStates((prev) => ({
                          ...prev,
                          skillInput: e.target.value,
                        }))
                      }
                      onKeyPress={handleSkillKeyPress}
                      onBlur={() => {
                        if (inputStates.skillInput.trim()) {
                          addSkill();
                        } else {
                          setInputStates((prev) => ({
                            ...prev,
                            showSkillInput: false,
                          }));
                        }
                      }}
                      placeholder="Enter skill"
                      className="bg-transparent border-none outline-none text-sm px-1 w-24 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="text-green-500 hover:text-green-600 transition-colors ml-1"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setInputStates((prev) => ({
                        ...prev,
                        showSkillInput: true,
                      }))
                    }
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-blue-300 rounded-full text-sm font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Skill
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Add skills required for this project (React, Python, etc.)
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                Project Tags*
              </label>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:shadow-sm transition-all duration-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-purple-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Tag Input */}
                {inputStates.showTagInput ? (
                  <div className="inline-flex items-center bg-white border border-purple-300 rounded-full px-2 py-1 shadow-sm">
                    <span className="text-purple-600 text-sm">#</span>
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={inputStates.tagInput}
                      onChange={(e) =>
                        setInputStates((prev) => ({
                          ...prev,
                          tagInput: e.target.value,
                        }))
                      }
                      onKeyPress={handleTagKeyPress}
                      onBlur={() => {
                        if (inputStates.tagInput.trim()) {
                          addTag();
                        } else {
                          setInputStates((prev) => ({
                            ...prev,
                            showTagInput: false,
                          }));
                        }
                      }}
                      placeholder="tag name"
                      className="bg-transparent border-none outline-none text-sm px-1 w-20 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="text-green-500 hover:text-green-600 transition-colors ml-1"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setInputStates((prev) => ({
                        ...prev,
                        showTagInput: true,
                      }))
                    }
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-purple-300 rounded-full text-sm font-medium text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Tag
                  </button>
                )}
              </div>

              {/* Suggested tags */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">
                  Suggested tags (click to add):
                </p>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags.map(
                    (tag) =>
                      !formData.tags.includes(tag) && (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...prev.tags, tag],
                            }));
                          }}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all duration-200"
                        >
                          +{tag}
                        </button>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Type*
              </label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 appearance-none bg-white cursor-pointer"
                  required
                >
                  {jobTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Budget (in NPR)*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ₨
                </span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  placeholder="5000"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Fair pricing attracts quality freelancers
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="E.g. Kathmandu, Nepal"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Location Type*
              </label>
              <div className="relative">
                <select
                  value={formData.locationType}
                  onChange={(e) =>
                    handleInputChange("locationType", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 appearance-none bg-white cursor-pointer"
                  required
                >
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading || success}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                isFormValid && !isLoading && !success
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting Project...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5 mr-2" />
                  Post Freelance Project
                </>
              )}
            </button>

            {!isFormValid && !isLoading && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Please fill in all required fields to post your project
              </p>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Pro Tips for Better Results
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Be clear about deliverables and timeline</li>
                  <li>• Set realistic budgets for quality work</li>
                  <li>• Include relevant skills to attract right talent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceProjectForm;
