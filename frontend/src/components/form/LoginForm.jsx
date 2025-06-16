import React, { useContext, useState } from "react";
import { BookOpen, Users, DollarSign, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(credentials);
      console.log(res, "Login Response");
      console.log("User Role:", res.user);

      if (res.user.role === "STUDENT") {
        navigate("/dashboard");
      } else if (res.user.role === "EMPLOYER") {
        navigate("/employer-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div
              className="bg-blue-600 p-3 rounded-full"
              style={{ backgroundColor: "#2A66DE" }}
            >
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Empowering Nepali Students to{" "}
            <span className="font-semibold" style={{ color: "#2A66DE" }}>
              Learn
            </span>
            ,
            <span className="font-semibold" style={{ color: "#2A66DE" }}>
              {" "}
              Teach
            </span>
            , and
            <span className="font-semibold" style={{ color: "#2A66DE" }}>
              {" "}
              Earn
            </span>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-600 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                style={{ "--tw-ring-color": "#2A66DE" }}
                onFocus={(e) =>
                  e.target.style.setProperty("--tw-ring-color", "#2A66DE")
                }
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={credentials.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-600 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  style={{ "--tw-ring-color": "#2A66DE" }}
                  onFocus={(e) =>
                    e.target.style.setProperty("--tw-ring-color", "#2A66DE")
                  }
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded"
                  style={{ accentColor: "#2A66DE" }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "#2A66DE" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full text-white py-3 px-4 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: "#2A66DE",
                "--tw-ring-color": "#2A66DE",
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-4">
              What awaits you:
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-2 rounded-full mb-2">
                  <BookOpen className="h-4 w-4" style={{ color: "#2A66DE" }} />
                </div>
                <span className="text-xs text-gray-600 font-medium">Learn</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-2 rounded-full mb-2">
                  <Users className="h-4 w-4" style={{ color: "#2A66DE" }} />
                </div>
                <span className="text-xs text-gray-600 font-medium">Teach</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-2 rounded-full mb-2">
                  <DollarSign
                    className="h-4 w-4"
                    style={{ color: "#2A66DE" }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">Earn</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="font-semibold transition-colors duration-200 hover:opacity-80"
                style={{ color: "#2A66DE" }}
              >
                Join our community
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🇳🇵 Proudly supporting Nepal's educational future
          </p>
        </div>
      </div>
    </div>
  );
}
