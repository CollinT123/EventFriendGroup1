"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", { email });
    // TODO: Implement actual password reset logic
    alert("Password reset link sent to your email!");
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
            Forgot Password
          </h1>
          <p className="text-lg text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
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

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            {/* Reset Password Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium text-base rounded-none border-0 transition-colors"
            >
              Reset Password
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
            Remember your password?{" "}
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