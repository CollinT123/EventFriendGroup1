import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedEye } from "@/components/ui/animated-eye";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempted with:", formData);
    // TODO: Implement actual sign up logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join Event Friend
          </h1>
          <p className="text-lg text-gray-600">
            Create your account to start connecting
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900"
              >
                First Name:
              </label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                placeholder="First name"
                className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900"
              >
                Last Name:
              </label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                placeholder="Last name"
                className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email:
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="Enter your email"
              className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password:
            </label>
            <div className="flex gap-0">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="Create a password"
                className="flex-1 h-12 text-base border-2 border-gray-900 border-r-0 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <AnimatedEye
                isOpen={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900"
            >
              Confirm Password:
            </label>
            <div className="flex gap-0">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                placeholder="Confirm your password"
                className="flex-1 h-12 text-base border-2 border-gray-900 border-r-0 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <AnimatedEye
                isOpen={showConfirmPassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base rounded-none border-0 transition-colors"
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
