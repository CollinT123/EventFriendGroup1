"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedEye } from "@/components/ui/animated-eye";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Sign up attempted with:", { email, password });
    // TODO: Implement actual sign up logic
  };

  const handleBackToLogin = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-lg text-gray-600">
            Join Event Friend today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium text-base rounded-none border-0 transition-colors"
            >
              Create Account
            </Button>

            {/* Back to Login Button */}
            <Button
              type="button"
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-base rounded-none border-2 border-gray-900 transition-colors"
            >
              Back to Login
            </Button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 