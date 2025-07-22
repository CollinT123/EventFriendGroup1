"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [oobCode, setOobCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the oobCode (reset token) from URL parameters
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
    } else {
      setError("Invalid or missing reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!oobCode) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password reset successfully! You can now sign in with your new password.");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/expired-action-code") {
        setError("This reset link has expired. Please request a new password reset.");
      } else if (err.code === "auth/invalid-action-code") {
        setError("Invalid reset link. Please request a new password reset.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
            Reset Password
          </h1>
          <p className="text-lg text-gray-600">
            Enter your new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              New Password:
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900"
            >
              Confirm Password:
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full h-12 text-base border-2 border-gray-900 rounded-none focus:ring-0 focus:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {/* Message/Error Display */}
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{message}</p>
              <p className="text-green-700 text-xs mt-1">Redirecting to login page...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            {/* Reset Password Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium text-base rounded-none border-0 transition-colors"
              disabled={loading || !oobCode}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            {/* Back to Login Button */}
            <Button
              type="button"
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-base rounded-none border-2 border-gray-900 transition-colors"
              disabled={loading}
            >
              Back to Login
            </Button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            Password must be at least 6 characters long
          </p>
          <p>
            Having trouble?{" "}
            <button
              onClick={() => router.push("/forgot-password")}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Request a new reset link
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 